#![allow(unused)]
mod db;
mod models;
mod controllers;
mod mailgun;
mod utils;
mod api_rate;

use std::net::{IpAddr, SocketAddr};
use tower::{buffer::BufferLayer, limit::RateLimitLayer, BoxError, ServiceBuilder};
use axum::{http, http::StatusCode, middleware, routing::{get}, Router};
use std::process::exit;
use std::sync::Arc;
use std::time::Duration;
use axum::error_handling::HandleErrorLayer;
use axum::routing::post;
use reqwest::multipart;
use tower_http::cors::{Any, CorsLayer};
use crate::controllers::*;
use crate::db::*;
use crate::mailgun::MailgunEmail;
use crate::models::ServerConfig;
use crate::api_rate::*;

#[tokio::main]
async fn main() {
    let db = Mongo::new().await.unwrap_or_else(|e| {
        eprintln!("Failed to connect to the database: {}", e);
        exit(1);
    });

    let config = ServerConfig { db };

    let mut app = Router::new()
        .route("/license", post(get_license))
        .route("/get_user", post(get_user))
        .route("/activate_license", post(activate_licence))
        .route("/remove_machine", post(remove_machine))
        .route("/create", post(create_user))
        .route("/logs", get(get_all_logs))
        .route("/save_presets", post(save_presets));

    if cfg!(debug_assertions) {
        app = app.layer(CorsLayer::new()
                            .allow_origin(Any) // Autorise toutes les origines
                            .allow_methods(Any) // Autorise toutes les méthodes HTTP
                            .allow_headers([http::header::CONTENT_TYPE]) // Autorise l'en-tête Content-Type
        )
    }

    let rate_limiter = Arc::new(RateLimiter::new(32, Duration::from_secs(60)));

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
                .layer(middleware::from_fn(move |req, next| {
                    let rate_limiter = Arc::clone(&rate_limiter);
                    rate_limit_middleware(req, next, rate_limiter)
                }))
        );

    let addr = SocketAddr::from(([0, 0, 0, 0], 3000));

    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app.into_make_service_with_connect_info::<SocketAddr>())
        .await
        .unwrap();
}