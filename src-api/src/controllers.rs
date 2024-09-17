#![allow(unused)]

use std::net::SocketAddr;
use crate::models::{ServerConfig, User};
use axum::extract::{ConnectInfo, FromRequest, Path, State};
use axum::http::{HeaderMap, StatusCode};
use axum::Json;
use axum::response::IntoResponse;
use mongodb::bson;
use mongodb::bson::Uuid;
use mongodb::error::Error;
use serde::{Deserialize, Serialize};
use serde_json::{json, Value};
use crate::models;
use crate::db::Mongo;

pub async fn handle_get_user_by_key(Path((user_key)): Path<(Uuid)>, State(config): State<ServerConfig>) -> Result<(StatusCode, String), (StatusCode, String)> {
    // Rechercher l'utilisateur par 'key'
    let user = config.db.find_user_by_key(&user_key).await;

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
            used: false,
        };
        match config.db.insert_user(&user).await {
            Ok(_) => Ok((StatusCode::CREATED, json!(user).to_string())),
            Err(_) => Err((StatusCode::INTERNAL_SERVER_ERROR, "Failed to create user".to_string())),
        }
    } else {
        Err((StatusCode::NOT_FOUND, "".to_string()))
    }
}