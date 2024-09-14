#![allow(unused)]

use crate::models::{ServerConfig, User};
use axum::extract::State;
use axum::http::{HeaderMap, StatusCode};
use axum::response::IntoResponse;
use axum::Json;
use mongodb::error::Error;
use serde::Serialize;
use serde_json::json;

fn json_response<T>(data: T) -> impl IntoResponse
where
    T: Serialize,
{
    Json(data).into_response()
}

pub async fn handle_get_user_by_uuid(headers: HeaderMap, State(config): State<ServerConfig>) -> Result<(StatusCode, String), (StatusCode, String)> {
    // Extraire l'en-tête 'key'
    let key_header = headers.get("key");

    // Vérifier si l'en-tête 'key' est présent
    if key_header.is_none() {
        return Err((StatusCode::BAD_REQUEST, "Missing 'key' header".to_string()));
    }

    // Extraire la valeur de l'en-tête 'key'
    let key = key_header.unwrap().to_str().unwrap();

    // Rechercher l'utilisateur par 'key'
    let user = config.db.find_user_by_key(key).await;

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