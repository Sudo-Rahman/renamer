#![allow(unused)]
mod db;
mod models;
mod controllers;

use axum::{
    extract::{Path, State},
    http::StatusCode,
    routing::{get, patch},
    Json, Router,
};
use serde_json::json;
use std::process::exit;
use mongodb::bson;
use uuid::{Timestamp, Uuid};
use crate::controllers::*;
use crate::db::*;
use crate::models::ServerConfig;

#[tokio::main]
async fn main() {
    let db = Mongo::new().await.unwrap_or_else(|_| {
        eprintln!("Failed to connect to the database");
        exit(1);
    });

    let config = ServerConfig { db };

    let app = Router::new()
        .route("/users", get(get_all_users))
        .route("/user/:key", get(handle_get_user_by_key))
        .with_state(config);

    // run our app with hyper, listening globally on port 3000
    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000").await.unwrap();


    axum::serve(listener, app).await.unwrap();
}