#![allow(unused)]
use tauri::Wry;
use tauri_plugin_store::{with_store, StoreCollection};
use serde_json::json;
use tauri_plugin_http::reqwest;

#[cfg(debug_assertions)]
pub const API_URL: &str = "http://localhost:3000/";

#[cfg(not(debug_assertions))]
pub const API_URL: &str = "https://api.votreapp.com";


#[tauri::command]
pub async fn check_licence(user_key: &str) -> Result<String, String> {
    let res = reqwest::get(API_URL.to_string().to_owned() + "user/" + user_key).await;
    match res {
        Ok(res) => {
            if res.status().is_success() {
                Ok(res.text().await.unwrap())
            } else {
                Err(res.text().await.unwrap())
            }
        }
        Err(err) => {
            eprintln!("Error checking auth: {}", err);
            Err(err.to_string())
        }
    }
}