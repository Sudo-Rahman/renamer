#![allow(unused)]

use std::any::TypeId;
use crate::db::Mongo;
use crate::mailgun::MailgunEmail;
use crate::models::{user_to_user_machine, Log, ServerConfig, User};
use renamer_shared::{UserMachine, Machine};
use axum::extract::{ConnectInfo, State};
use axum::http::StatusCode;
use axum::Json;
use mongodb::bson;
use mongodb::bson::Uuid;
use serde::de::DeserializeOwned;
use serde_json::{json, Value};
use std::fmt::Debug;
use std::net::SocketAddr;

fn extract_field<T>(body: &Value, field: &str) -> Result<T, (StatusCode, String)>
where
    T: DeserializeOwned + Debug,
{
    let value = body.get(field).ok_or_else(|| {
        let mut message = "Error".to_string();
        if (cfg!(debug_assertions)) {
            message = format!("Missing field: {}", field);
        }
        (StatusCode::BAD_REQUEST, message)
    })?;

    // On essaie directement de désérialiser en T
    serde_json::from_value(value.clone()).map_err(|e| {
        (StatusCode::BAD_REQUEST, format!("Failed to deserialize field '{}': {}", field, e))
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
    Json(body): Json<Value>,
) -> Result<(StatusCode, String), (StatusCode, String)> {
    let user = config.db.find_user(&body_user_to_document(&body)).await;
    let user_machine = match serde_json::from_value::<UserMachine>(body.clone()) {
        Ok(machine) => machine,
        Err(e) => return Err((StatusCode::BAD_REQUEST, format!("Failed to deserialize machine: {}", e))),
    };
    // Vérifier si l'utilisateur existe
    match user {
        Ok(user) => {
            if user.is_none() {
                Err((StatusCode::NOT_FOUND, "User not found".to_string()))
            } else {
                if user.unwrap().machines.iter().any(|m| m.id == user_machine.machine.id) {
                    Ok((StatusCode::OK, json!(user_machine).to_string()))
                } else {
                    Err((StatusCode::UNAUTHORIZED, "Machine not found".to_string()))
                }
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
        let email = extract_field::<String>(&body, "email")?;
        let plan = extract_field::<u8>(&body, "plan")?;

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

fn activate_licence_plan(
    user: &mut User,
    plan: u8,
    Json(body): Json<Value>,
) -> Result<(), (StatusCode, String)> {
    // Closure qui modifie user.machines
    let push = |user: &mut User, Json(body): Json<Value>| {
        user.machines.push(Machine {
            id: body["machine"].as_object().unwrap()["id"].as_str().unwrap().to_string(),
            device_name: body["machine"].as_object().unwrap()["device_name"].as_str().unwrap().to_string(),
        });
    };

    match plan {
        0 => {
            // Effectuer les vérifications immuables avant l'emprunt mutable
            if !user.machines.is_empty() {
                Err((StatusCode::BAD_REQUEST, "User already has a machine".to_string()))
            } else {
                // Emprunt mutable seulement après les vérifications immuables
                push(user, Json(body));
                Ok(())
            }
        }
        1 => {
            // Vérifications avant l'emprunt mutable
            if user.machines.len() >= 5 {
                Err((StatusCode::BAD_REQUEST, "User already has 5 machines".to_string()))
            } else {
                // Vérification si l'ID de la machine existe déjà
                let machine_exists = user.machines.iter().any(|m| m.id == body["machine"].as_object().unwrap()["id"].as_str().unwrap());

                if !machine_exists {
                    // Emprunt mutable seulement après les vérifications immuables
                    push(user, Json(body));
                }
                Ok(())
            }
        }
        _ => Err((StatusCode::BAD_REQUEST, "Invalid plan".to_string())),
    }
}


pub async fn activate_licence(
    State(config): State<ServerConfig>,
    ConnectInfo(addr): ConnectInfo<SocketAddr>,
    Json(body): Json<Value>,
) -> Result<(StatusCode, String), (StatusCode, String)> {
    let key = extract_field::<String>(&body, "key")?;
    let machine = extract_field::<Value>(&body, "machine")?;
    let machine = match serde_json::from_value::<Machine>(machine) {
        Ok(machine) => machine,
        Err(e) => return Err((StatusCode::BAD_REQUEST, format!("Failed to deserialize machine: {}", e))),
    };

    let user = config.db.find_user(
        &bson::doc! {
            "key": Uuid::parse_str(key.clone()).unwrap(),
        }
    ).await.unwrap();

    match user {
        Some(user) => {
            if user.key.to_string() == key.clone() {
                let mut updated_user = user.clone();
                activate_licence_plan(&mut updated_user, user.plan, Json(body))?;
                match config.db.activate_licence(&updated_user).await {
                    Ok(_) => Ok((StatusCode::OK, json!(
                        user_to_user_machine(updated_user, machine)
                    ).to_string())),
                    Err(_) => Err((StatusCode::INTERNAL_SERVER_ERROR, "Failed to update user".to_string())),
                }
            } else {
                Err((StatusCode::UNAUTHORIZED, "Invalid key or machine_id".to_string()))
            }
        }
        None => Err((StatusCode::NOT_FOUND, "User not found".to_string()))
    }
}

pub(crate) async fn remove_machine(
    State(config): State<ServerConfig>,
    Json(body): Json<Value>,
) -> Result<(StatusCode, String), (StatusCode, String)> {
    let key = extract_field::<String>(&body, "key")?;
    let email = extract_field::<String>(&body, "email")?;
    let machine = extract_field::<Value>(&body, "machine")?;
    let machine = Machine {
        id: extract_field::<String>(&machine, "id")?,
        device_name: extract_field::<String>(&machine, "device_name")?,
    };

    let parsed_key = match Uuid::parse_str(key.clone()) {
        Ok(uuid) => uuid,
        Err(_) => return Err((StatusCode::BAD_REQUEST, "Invalid license key".to_string())),
    };

    let doc = &bson::doc! {
            "email": email.clone(),
            "key": parsed_key,
        };

    let mut machines = config.db.find_user(doc).await.unwrap().ok_or_else(|| {
        (StatusCode::NOT_FOUND, "User not found".to_string())
    })?.machines;
    if !machines.iter().any(|m| m.id == machine.id) {
        return Err((StatusCode::BAD_REQUEST, "Machine not found".to_string()));
    }
    machines.retain(|m| m.id != machine.id);

    match config.db.update_machines(
        doc,
        &machines,
    ).await {
        Ok(_) => {
            let email = MailgunEmail {
                from: "noreply@renamer.sudo-rahman.fr".to_string(),
                to: email.to_string(),
                subject: "License Renamer".to_string(),
                text: format!("Machine name {} removed", machine.device_name),
            };
            match email.send().await {
                Ok(_) => {}
                Err(log) => {
                    config.db.insert_log(log).await;
                }
            }
            Ok((StatusCode::OK, "Machine removed".to_string()))
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

pub(crate) async fn get_user(
    ConnectInfo(addr): ConnectInfo<SocketAddr>,
    State(config): State<ServerConfig>,
    Json(body): Json<Value>)
    -> Result<(StatusCode, String), (StatusCode, String)> {
    let email = extract_field::<String>(&body, "email")?;
    let key = extract_field::<String>(&body, "key")?;
    let user = config.db.find_user(
        &bson::doc! {
            "email": email.clone(),
            "key": Uuid::parse_str(key.clone()).unwrap(),
        }
    ).await.unwrap();

    match user {
        Some(user) => {
            if user.key.to_string() == key.clone() {
                Ok((StatusCode::OK, serde_json::to_string(&user).unwrap()))
            } else {
                Err((StatusCode::UNAUTHORIZED, "Invalid key".to_string()))
            }
        }
        None => Err((StatusCode::NOT_FOUND, "User not found".to_string()))
    }
}
