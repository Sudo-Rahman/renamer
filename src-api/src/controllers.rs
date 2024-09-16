#![allow(unused)]

use crate::models::{ServerConfig, User};
use axum::extract::{Path, State};
use axum::http::{HeaderMap, StatusCode};
use axum::response::IntoResponse;
use mongodb::bson;
use mongodb::bson::Uuid;
use mongodb::error::Error;
use serde::Serialize;
use serde_json::json;

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