#![allow(unused)]

use crate::db::Mongo;
use crate::mailgun::MailgunEmail;
use crate::models::{Log, Machine, ServerConfig, User};
use axum::extract::{ConnectInfo, State};
use axum::http::StatusCode;
use axum::Json;
use mongodb::bson;
use mongodb::bson::Uuid;
use serde::de::DeserializeOwned;
use serde_json::{json, Value};
use std::fmt::Debug;
use std::net::SocketAddr;

#[derive(Debug)]
enum JsonFieldType {
    Str,
    Int,
    Bool,
    Object,
    Array,
}

fn extract_field<T>(body: &Value, field: &str, field_type: JsonFieldType) -> Result<T, (StatusCode, String)>
where
    T: DeserializeOwned + Debug,
{
    let value = body.get(field).ok_or_else(|| {
        (StatusCode::BAD_REQUEST, format!("Missing field: {}", field))
    })?;

    let type_check_result = match field_type {
        JsonFieldType::Str => value.is_string(),
        JsonFieldType::Int => value.is_i64(),
        JsonFieldType::Bool => value.is_boolean(),
        JsonFieldType::Object => value.is_object(),
        JsonFieldType::Array => value.is_array(),
        // Ajoutez d'autres vérifications de type selon vos besoins
    };

    if !type_check_result {
        return Err((StatusCode::BAD_REQUEST, format!("Invalid type for field: {}. Expected {:?}.", field, field_type)));
    }

    serde_json::from_value(value.clone()).map_err(|e| {
        (StatusCode::BAD_REQUEST, format!("Failed to deserialize field {}: {}", field, e))
    })
}

fn body_user_to_document(body: &Value) -> bson::Document {
    bson::doc! {
            "email": body["email"].as_str().unwrap(),
            "key": Uuid::parse_str(body["key"].as_str().unwrap()).unwrap(),
        }
}

pub async fn get_license(
    State(config): State<ServerConfig>,
    Json(payload): Json<Value>,
) -> Result<(StatusCode, String), (StatusCode, String)> {
    let user = config.db.find_user(&body_user_to_document(&payload)).await;
    println!("{:?}", user);

    // Vérifier si l'utilisateur existe
    match user {
        Ok(user) => {
            if user.is_none() {
                Err((StatusCode::NOT_FOUND, "User not found".to_string()))
            } else {
                Ok((StatusCode::OK, json!(user).to_string()))
            }
        }
        Err(_) => Err((StatusCode::INTERNAL_SERVER_ERROR, "Failed to find user".to_string()))
    }
}

pub async fn get_all_users(State(config): State<ServerConfig>) -> Result<(StatusCode, String), (StatusCode, String)> {
    match config.db.find_all_users().await {
        Ok(users) => Ok((StatusCode::OK, serde_json::to_string(&users).unwrap())),
        Err(_) => Err((StatusCode::INTERNAL_SERVER_ERROR, "Failed to find users".to_string()))
    }
}

async fn user_exists(email: &str, db: &Mongo) -> bool {
    let user = db.find_user_by_email(email).await.unwrap();
    user.is_some()
}

pub async fn create_user(
    State(config): State<ServerConfig>,
    ConnectInfo(addr): ConnectInfo<SocketAddr>,
    Json(body): Json<Value>,
) -> Result<(StatusCode, String), (StatusCode, String)> {
    if (addr.ip().is_loopback()) {
        let email = body["email"].as_str().ok_or_else(|| {
            (StatusCode::BAD_REQUEST, "Invalid or missing email".to_string())
        })?;
        let plan = body["plan"].as_u64().ok_or_else(|| {
            (StatusCode::BAD_REQUEST, "Invalid or missing plan".to_string())
        })?;

        let user = User {
            _id: bson::oid::ObjectId::new(),
            email: email.to_string(),
            plan: plan as u8,
            key: Uuid::from_bytes(*uuid::Uuid::now_v7().as_bytes()),
            machines: vec![],
        };
        match config.db.insert_user(&user).await {
            Ok(_) => {
                let email = MailgunEmail {
                    from: "noreply@renamer.sudo-rahman.fr".to_string(),
                    to: email.to_string(),
                    subject: "Your license key".to_string(),
                    text: "Here is your license key: ".to_string() + &user.key.to_string(),
                };
                match email.send().await {
                    Ok(_) => {}
                    Err(log) => {
                        config.db.insert_log(log).await;
                    }
                }
                Ok((StatusCode::CREATED, json!(user).to_string()))
            }
            Err(_) => {
                config.db.insert_log(Log {
                    _id: bson::oid::ObjectId::new(),
                    date_time: bson::DateTime::now(),
                    message: format!("Failed to create user: {}", email),
                }).await;
                Err((StatusCode::INTERNAL_SERVER_ERROR, "Failed to create user".to_string()))
            }
        }
    } else {
        Err((StatusCode::NOT_FOUND, "".to_string()))
    }
}

fn activate_licence_plan(user: &mut User, plan: u8, Json(body): Json<Value>) -> Result<(), (StatusCode, String)> {
    const PUSH: fn() = || {
        user.machines.push(Machine {
            id: body["machine"].as_object().unwrap()["id"].as_str().unwrap().to_string(),
            device_name: body["machine"].as_object().unwrap()["device_name"].as_str().unwrap().to_string(),
        });
    };

    match plan {
        0 => {
            if !user.machines.is_empty() {
                Err((StatusCode::BAD_REQUEST, "User already has a machine".to_string()))
            } else {
                PUSH();
                Ok(())
            }
        }
        1 => {
            // insert if not exists
            if user.machines.len() >= 5 {
                Err((StatusCode::BAD_REQUEST, "User already has 5 machines".to_string()))
            } else {
                if user.machines.iter().find(|m| m.id == body["machine"].as_object().unwrap()["id"].as_str().unwrap()).is_none() {
                    PUSH();
                }
                Ok(())
            }
        }
        _ => { Err((StatusCode::BAD_REQUEST, "Invalid plan".to_string())) }
    }
}

pub async fn activate_licence(
    State(config): State<ServerConfig>,
    ConnectInfo(addr): ConnectInfo<SocketAddr>,
    Json(body): Json<Value>,
) -> Result<(StatusCode, String), (StatusCode, String)> {
    let key = extract_field::<String>(&body, "key", JsonFieldType::Str)?;
    let machine = extract_field::<Value>(&body, "machine", JsonFieldType::Object)?;
    extract_field::<String>(&machine, "id", JsonFieldType::Str)?;
    extract_field::<String>(&machine, "device_name", JsonFieldType::Str)?;

    let user = config.db.find_user(
        &bson::doc! {
            "key": Uuid::parse_str(key.clone()).unwrap(),
        }
    ).await.unwrap();
    println!("{:?}", user);

    match user {
        Some(user) => {
            if user.key.to_string() == key.clone() {
                let mut updated_user = user.clone();
                activate_licence_plan(&mut updated_user, user.plan, Json(body));
                match config.db.activate_licence(&updated_user).await {
                    Ok(_) => Ok((StatusCode::OK, json!(updated_user).to_string())),
                    Err(_) => Err((StatusCode::INTERNAL_SERVER_ERROR, "Failed to update user".to_string())),
                }
            } else {
                Err((StatusCode::UNAUTHORIZED, "Invalid key or machine_id".to_string()))
            }
        }
        None => Err((StatusCode::NOT_FOUND, "User not found".to_string()))
    }
}

pub(crate) async fn reset_license(
    State(config): State<ServerConfig>,
    Json(body): Json<Value>,
) -> Result<(StatusCode, String), (StatusCode, String)> {
    let key = extract_field::<String>(&body, "key", JsonFieldType::Str)?;
    let email = extract_field::<String>(&body, "email", JsonFieldType::Str)?;
    let machine = extract_field::<Value>(&body, "machine", JsonFieldType::Object)?;
    let machine = Machine {
        id: extract_field::<String>(&machine, "id", JsonFieldType::Str)?,
        device_name: extract_field::<String>(&machine, "device_name", JsonFieldType::Str)?,
    };

    let parsed_key = match Uuid::parse_str(key.clone()) {
        Ok(uuid) => uuid,
        Err(_) => return Err((StatusCode::BAD_REQUEST, "Invalid license key".to_string())),
    };

    match config.db.clear_license(
        &bson::doc! {
            "email": email.clone(),
            "key": parsed_key,
        },
        &machine,
    ).await {
        Ok(_) => {
            let email = MailgunEmail {
                from: "noreply@renamer.sudo-rahman.fr".to_string(),
                to: email.to_string(),
                subject: "License key".to_string(),
                text: format!("Your license key {} has been reset", key.clone()),
            };
            match email.send().await {
                Ok(_) => {}
                Err(log) => {
                    config.db.insert_log(log).await;
                }
            }
            Ok((StatusCode::OK, "License has been reset".to_string()))
        }
        Err(_) => Err((StatusCode::INTERNAL_SERVER_ERROR, "Failed to reset license".to_string()))
    }
}

pub(crate) async fn get_all_logs(
    ConnectInfo(addr): ConnectInfo<SocketAddr>,
    State(config): State<ServerConfig>,
) -> Result<(StatusCode, String), (StatusCode, String)> {
    if (addr.ip().is_loopback()) {
        match config.db.get_all_logs().await {
            Ok(logs) => Ok((StatusCode::OK, serde_json::to_string(&logs).unwrap())),
            Err(_) => Err((StatusCode::INTERNAL_SERVER_ERROR, "Failed to get logs".to_string()))
        }
    } else {
        Err((StatusCode::NOT_FOUND, "".to_string()))
    }
}