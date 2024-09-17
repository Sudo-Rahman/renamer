#![allow(unused)]

use crate::app::User;
use std::path::PathBuf;
use serde_json::json;
use tauri::{AppHandle, Manager, Wry};
use tauri_plugin_http::reqwest;
use tauri_plugin_store::{with_store, StoreCollection};

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

#[tauri::command]
pub(crate) async fn get_license(app: tauri::AppHandle) -> Result<String, String> {
    println!("Getting license");
    Ok("license".to_string())
}

#[tauri::command]
pub(crate) async fn save_license(app: tauri::AppHandle) -> Result<bool, String> {
    Ok(true)
}