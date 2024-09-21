#![allow(unused)]

use crate::db::Mongo;
use crate::models::{ServerConfig, User};
use axum::extract::{ConnectInfo, State};
use axum::http::StatusCode;
use axum::Json;
use mongodb::bson;
use mongodb::bson::Uuid;
use serde_json::{json, Value};
use std::net::SocketAddr;

fn payload_user_to_document(payload: &Value) -> bson::Document {
    bson::doc! {
            "email": payload["email"].as_str().unwrap(),
            "key": Uuid::parse_str(payload["key"].as_str().unwrap()).unwrap(),
        }
}

pub async fn get_license(
    State(config): State<ServerConfig>,
    Json(payload): Json<Value>,
) -> Result<(StatusCode, String), (StatusCode, String)> {
    let user = config.db.find_user(&payload_user_to_document(&payload)).await;
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
    Json(payload): Json<Value>,
) -> Result<(StatusCode, String), (StatusCode, String)> {
    println!("{:?}", addr);
    if (addr.ip().is_loopback()) {
        let email = payload["email"].as_str().ok_or_else(|| {
            (StatusCode::BAD_REQUEST, "Invalid or missing email".to_string())
        })?;
        if user_exists(&email, &config.db).await {
            return Err((StatusCode::CONFLICT, "User already exists".to_string()));
        }
        let user = User {
            _id: bson::oid::ObjectId::new(),
            email: email.to_string(),
            key: Uuid::from_bytes(*uuid::Uuid::now_v7().as_bytes()),
            machine_id: "".to_string(),
        };
        match config.db.insert_user(&user).await {
            Ok(_) => Ok((StatusCode::CREATED, json!(user).to_string())),
            Err(_) => Err((StatusCode::INTERNAL_SERVER_ERROR, "Failed to create user".to_string())),
        }
    } else {
        Err((StatusCode::NOT_FOUND, "".to_string()))
    }
}

pub async fn activate_licence(
    State(config): State<ServerConfig>,
    ConnectInfo(addr): ConnectInfo<SocketAddr>,
    Json(payload): Json<Value>,
) -> Result<(StatusCode, String), (StatusCode, String)> {
    let key = payload["key"].as_str().ok_or_else(|| {
        (StatusCode::BAD_REQUEST, "Invalid or missing key".to_string())
    })?;
    let machine_id = payload["machine_id"].as_str().ok_or_else(|| {
        (StatusCode::BAD_REQUEST, "Invalid or missing machine_id".to_string())
    })?;
    let user = config.db.find_user(
        &bson::doc! {
            "key": Uuid::parse_str(key).unwrap(),
        }
    ).await.unwrap();
    println!("{:?}", user);

    match user {
        Some(user) => {
            if user.key.to_string() == key && user.machine_id.as_str().is_empty() {
                let updated_user = User {
                    _id: user._id,
                    email: user.email,
                    key: user.key,
                    machine_id: machine_id.to_string(),
                };
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

pub(crate) async fn clear_license(
    State(config): State<ServerConfig>,
    Json(payload): Json<Value>,
) -> Result<(StatusCode, String), (StatusCode, String)> {
    let key = payload["key"].as_str().ok_or_else(|| {
        (StatusCode::BAD_REQUEST, "Invalid or missing key".to_string())
    })?;
    let email = payload["email"].as_str().ok_or_else(|| {
        (StatusCode::BAD_REQUEST, "Invalid or missing machine_id".to_string())
    })?;
    match config.db.clear_license(
        &bson::doc! {
            "email": email,
            "key": Uuid::parse_str(key).unwrap(),
        }
    ).await {
        Ok(_) => Ok((StatusCode::OK, "License cleared".to_string())),
        Err(_) => Err((StatusCode::INTERNAL_SERVER_ERROR, "Failed to clear license".to_string()))
    }
}