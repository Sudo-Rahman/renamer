use axum::body::{Body, Bytes, to_bytes};
use axum::http::{Request, Response, StatusCode};
use axum::middleware::Next;
use axum::response::IntoResponse;
use log::info;

pub async fn log_request_response(
    req: Request<Body>,
    next: Next,
) -> Result<impl IntoResponse, (StatusCode, String)> {
    println!("📥 Incoming request");
    info!("📍 Headers: {:?}", req.headers());
    let path = req.uri().path().to_string();
    let (req_parts, req_body) = req.into_parts();
    let bytes = buffer_and_print("request", &path, req_body, true).await?;
    let req = Request::from_parts(req_parts, Body::from(bytes));
    let res = next.run(req).await;
    let (mut res_parts, res_body) = res.into_parts();
    let bytes = buffer_and_print("response", &path, res_body, true).await?;
    res_parts.headers.remove("transfer-encoding");
    let res = Response::from_parts(res_parts, Body::from(bytes));
    println!("📤 Outgoing response\n");
    Ok(res)
}

async fn buffer_and_print(
    direction: &str,
    path: &str,
    body: Body,
    log: bool,
) -> Result<Bytes, (StatusCode, String)> {
    let bytes = match to_bytes(body, usize::MAX).await {
        Ok(bytes) => bytes,
        Err(err) => {
            return Err((
                StatusCode::BAD_REQUEST,
                format!("failed to read {} body: {}", direction, err),
            ));
        }
    };
    if let Ok(body_str) = std::str::from_utf8(&bytes) {
        if log && !body_str.is_empty() {
            info!("════════════════════════════════");
            info!("🤖 {} for path: {}", direction, path);
            info!("📝 Body: {}", body_str);
        }
    }
    Ok(bytes)
}

