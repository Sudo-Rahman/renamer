use axum::{
    extract::Request,
    http::StatusCode,
    middleware::{self, Next},
    response::{IntoResponse, Response},
    routing::get,
    Json, Router,
};
use dashmap::DashMap;
use std::{
    net::SocketAddr,
    sync::Arc,
    time::{Duration, Instant},
};
use std::net::IpAddr;
use tokio::sync::Mutex;

// Structure pour stocker les informations de rate limiting
#[derive(Clone)]
pub struct RateLimiter {
    requests: Arc<DashMap<String, (Instant, u32)>>,
    limit: u32,
    window: Duration,
}

impl RateLimiter {
    pub fn new(limit: u32, window: Duration) -> Self {
        Self {
            requests: Arc::new(DashMap::new()),
            limit,
            window,
        }
    }

    // Vérifie si une adresse IP a dépassé la limite de requêtes
    fn check(&self, ip: &str) -> Result<(), StatusCode> {
        let mut entry = self.requests.entry(ip.to_string()).or_insert((Instant::now(), 0));
        let (start_time, count) = entry.value_mut();

        // Réinitialiser le compteur si la fenêtre de temps est écoulée
        if start_time.elapsed() > self.window {
            *start_time = Instant::now();
            *count = 0;
        }

        // Vérifier si la limite est dépassée
        if *count >= self.limit {
            return Err(StatusCode::TOO_MANY_REQUESTS);
        }

        // Incrémenter le compteur
        *count += 1;
        Ok(())
    }
}

// Middleware pour appliquer le rate limiting
pub async fn rate_limit_middleware(
    request: Request,
    next: Next,
    rate_limiter: Arc<RateLimiter>,
) -> Result<Response, StatusCode> {

    // Récupérer l'adresse IP du client
    let ip = request
        .headers()
        .get("X-Forwarded-For") // Utilisé si l'API est derrière un proxy
        .or_else(|| request.headers().get("X-Real-IP"))
        .or_else(|| request.headers().get("host"))
        .and_then(|v| v.to_str().ok())
        .unwrap_or("unknown");

    // Vérifier si l'adresse IP est une adresse de loopback
    let is_loopback = match ip.parse::<IpAddr>() {
        Ok(IpAddr::V4(ipv4)) => ipv4.is_loopback(),
        Ok(IpAddr::V6(ipv6)) => ipv6.is_loopback(),
        Err(_) => false, // En cas d'erreur de parsing, traiter comme une IP normale
    };


    // Ignorer le rate limiting pour les adresses de loopback
    if !is_loopback {
        rate_limiter.check(ip)?;
    }

    // Passer à la prochaine étape du middleware
    Ok(next.run(request).await)
}