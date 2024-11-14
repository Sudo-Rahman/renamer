#![allow(unused)]

extern crate mid;
use crate::app::{APPLICATION};
use reqwest::{Client, StatusCode};
use serde_json::Value::Null;
use serde_json::{json, Value};
use std::path::PathBuf;
use std::str::FromStr;
use whoami;

use renamer_shared::UserMachine;
use tauri::{Manager, Wry};
use tauri_plugin_store::StoreExt;

#[cfg(debug_assertions)]
pub const API_URL: &str = "http://localhost:3000";

#[cfg(not(debug_assertions))]
pub const API_URL: &str = "https://api.renamer.sudo-rahman.fr";

#[tauri::command]
pub async fn check_licence(user: UserMachine) -> Result<String, String> {
    let client = Client::new();

    let res = client
        .post(format!("{}/license", API_URL))
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
    let store = APPLICATION.lock().await.get_store(app.clone()).await;
    match store {
        Ok(store) => {
            let license = store.get("license").map(|value| value.to_string()).ok_or_else(|| "License key not found in store".to_string())?;
            Ok(license)
        }
        Err(_) => Err("Error getting store".to_string())
    }
}

#[tauri::command]
pub(crate) async fn save_license(app: tauri::AppHandle, user: Value) -> Result<bool, i8> {
    let store = APPLICATION.lock().await.get_store(app.clone()).await.map_err(
        |_| 1
    )?;
    store.set("license".to_string(), json!(user));
    Ok(true)
}

#[tauri::command]
pub(crate) async fn is_license_ok(app: tauri::AppHandle) -> Result<bool, i8> {
    let license = get_license(app.clone()).await;
    match license {
        Ok(license) => {
            if license.is_empty() {
                return Err(2);
            }

            let user = match serde_json::from_str::<UserMachine>(license.as_str()) {
                Ok(user) => user,
                Err(_) => return Err(1)
            };
            if (online::check(None).is_ok()) {
                let res = check_licence(user.clone()).await;
                match res {
                    Ok(res) => Ok(res == license),
                    Err(_) => Err(1),
                }
            } else {
                Ok(user.machine.id == get_machine_id())
            }
        }
        Err(_) => Err(1),
    }
}

#[tauri::command]
pub(crate) async fn activate_license(app: tauri::AppHandle, key: String) -> Result<bool, i8> {
    let application = APPLICATION.clone();
    application.lock().await.set_license(false);
    let client = Client::new();

    let license = json!({
       "key" : key,
        "machine" : json!({
            "id" : get_machine_id(),
            "device_name" : whoami::devicename()
        })
    });

    let res = client
        .post(format!("{}/activate_license", API_URL))
        .json(&license)
        .send()
        .await
        .or_else(|_| Err(1))?;


    if res.status().is_success() {
        let text = res.text().await;
        if (text.is_err()) {
            return Err(1);
        }
        let user = serde_json::Value::from_str(text.unwrap().as_str()).unwrap();
        save_license(app.clone(), user).await?;
        application.lock().await.set_license(true);
        Ok(true)
    } else if res.status() == StatusCode::UNAUTHORIZED {
        Err(2)
    } else {
        Err(1)
    }
}

pub(crate) fn get_machine_id() -> String {
    mid::get("383441314b796e4723444550584a656d664056436566442e5b2532655b44473e23436273713345794558572855547140545766344545735b70786e6a30364250").unwrap()
}

#[tauri::command]
pub(crate) async fn remove_license(app: tauri::AppHandle) -> Result<bool, i8> {
    let license = get_license(app.clone()).await;
    if license.is_err() {
        return Err(1);
    }
    let json = serde_json::from_str::<UserMachine>(license.unwrap().as_str()).unwrap();
    let client = Client::new();
    let res = client
        .post(format!("{}/remove_machine", API_URL))
        .json(&json)
        .send()
        .await
        .or_else(|_| Err(1))?;

    let store = APPLICATION.lock().await.get_store(app.clone()).await.or_else(|_| Err(1))?;
    store.set("license".to_string(), json!(null));
    APPLICATION.lock().await.set_license(false);
    Ok(true)
}
