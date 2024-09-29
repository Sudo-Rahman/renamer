#![allow(unused)]
mod db;
mod models;
mod controllers;
mod mailgun;
mod utils;

use std::net::{IpAddr, SocketAddr};
use tower::{buffer::BufferLayer, limit::RateLimitLayer, BoxError, ServiceBuilder};
use axum::{
    http::StatusCode,
    routing::{get}, Router,
};
use std::process::exit;
use std::time::Duration;
use axum::error_handling::HandleErrorLayer;
use axum::routing::post;
use reqwest::multipart;
use crate::controllers::*;
use crate::db::*;
use crate::models::ServerConfig;

#[tokio::main]
async fn main() {
    let db = Mongo::new().await.unwrap_or_else(|e| {
        eprintln!("Failed to connect to the database: {}", e);
        exit(1);
    });

    let config = ServerConfig { db };

    let mut app = Router::new()
        .route("/license", post(get_license))
        .route("/activate_license", post(activate_licence))
        .route("/reset_license", post(reset_license))
        .route("/create", post(create_user))
        .route("/logs", get(get_all_logs));

    let app = app.with_state(config)
        .layer(
            ServiceBuilder::new()
                .layer(HandleErrorLayer::new(|err: BoxError| async move {
                    (
                        StatusCode::INTERNAL_SERVER_ERROR,
                        format!("Unhandled error: {}", err),
                    )
                }))
                .layer(BufferLayer::new(1024))
                .layer(RateLimitLayer::new(10000, Duration::from_secs(60))),
        );

    let addr = SocketAddr::from(([0, 0, 0, 0], 3000));

    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app.into_make_service_with_connect_info::<SocketAddr>())
        .await
        .unwrap();
}