#![allow(unused)]

use crate::app::App;
use serde_json::Value::Null;
use serde_json::{json, Value};
use std::path::PathBuf;
use std::str::FromStr;
use reqwest::Client;

extern crate mid;
use tauri::{Manager, Wry};
use tauri_plugin_store::{with_store, StoreCollection};

#[cfg(debug_assertions)]
pub const API_URL: &str = "http://localhost:3000/";

#[cfg(not(debug_assertions))]
pub const API_URL: &str = "https://api.votreapp.com";


#[tauri::command]
pub async fn check_licence(user: Value) -> Result<String, String> {
    let client = Client::new();

    let res = client.get(format!("{}license", API_URL))
        .json(&user)
        .send()
        .await
        .map_err(|e| e.to_string())?;
    
    if res.status().is_success() {
        let text = res.text().await.map_err(|e| e.to_string())?;
        Ok(text)
    } else {
        let error_text = res.text().await.map_err(|e| e.to_string())?;
        Err(error_text)
    }
}

#[tauri::command]
pub(crate) async fn get_license(app: tauri::AppHandle) -> Result<String, String> {
    let stores = app.try_state::<StoreCollection<Wry>>().ok_or(Null.to_string())?;
    let license = with_store(app.clone(), stores, PathBuf::from(App::name_store()), |store| {
        let license = store.get("license").cloned();
        match license {
            Some(license) => {
                Ok(license)
            }
            None => {
                Ok(Null)
            }
        }
    });
    match license {
        Ok(license) => {
            if license.is_null() {
                return Err(Null.to_string());
            }
            Ok(license.to_string())
        }
        Err(_) => {
            Err(Null.to_string())
        }
    }
}

#[tauri::command]
pub(crate) async fn save_license(app: tauri::AppHandle, user: Value) -> Result<bool, i8> {
    let stores = app.try_state::<StoreCollection<Wry>>().ok_or(1)?;
    let license = with_store(app.clone(), stores, PathBuf::from(App::name_store()), |store| {
        store.insert("license".to_string(), json!(user))?;
        store.save()?;
        Ok(true)
    });
    Ok(license.unwrap())
}

#[tauri::command]
pub(crate) async fn is_license_ok(app: tauri::AppHandle) -> Result<bool, i8> {
    let license = get_license(app.clone()).await;
    match license {
        Ok(license) => {
            println!("License: {:?}", license);
            if license.is_empty() {
                return Ok(false);
            }

            let user = serde_json::Value::from_str(license.as_str()).unwrap();
            let machine_id = user["machine_id"].as_str();
            if (online::check(None).is_ok()) {
                // let res = check_licence(app.clone(), user["key"].as_str().unwrap()).await;
                Ok(true)
            } else {
                if machine_id.is_none() {
                    return Ok(false);
                }
                Ok(machine_id.unwrap() == get_machine_id() && user["email"].as_str().is_some() && user["key"].as_str().is_some())
            }
        }
        Err(_) => {
            Ok(false)
        }
    }
}

pub(crate) fn get_machine_id() -> String {
    mid::get("renamer").unwrap()
}