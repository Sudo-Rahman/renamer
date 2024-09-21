#![allow(unused)]

use crate::app::{App, APPLICATION};
use serde_json::Value::Null;
use serde_json::{json, Value};
use std::path::PathBuf;
use std::str::FromStr;
use std::thread::available_parallelism;
use reqwest::{Client, StatusCode};

extern crate mid;
use tauri::{Manager, Wry};
use tauri_plugin_store::{with_store, StoreCollection};

#[cfg(debug_assertions)]
pub const API_URL: &str = "http://localhost:3000/";

#[cfg(not(debug_assertions))]
pub const API_URL: &str = "https://api.renamer.sudo-rahman.fr";


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
            if license.is_empty() {
                return Err(2);
            }

            let user = serde_json::Value::from_str(license.as_str()).unwrap();
            let machine_id = user["machine_id"].as_str();
            if (online::check(None).is_ok()) {
                let res = check_licence(
                    json!({
                        "email": user["email"],
                        "key": user["key"]
                    })
                ).await;
                match res {
                    Ok(res) => {
                        Ok(res == license)
                    }
                    Err(_) => {
                        Err(1)
                    }
                }
            } else {
                if machine_id.is_none() {
                    return Err(1);
                }
                Ok(machine_id.unwrap() == get_machine_id() && user["email"].as_str().is_some() && user["key"].as_str().is_some())
            }
        }
        Err(_) => {
            Err(1)
        }
    }
}

#[tauri::command]
pub(crate) async fn activate_license(app: tauri::AppHandle, key: String) -> Result<bool, i8> {
    let application = APPLICATION.clone();
    application.lock().await.set_license(false);
    let client = Client::new();

    let license = json!({
       "key" : key,
        "machine_id": get_machine_id()
    });

    let res = client.post(format!("{}activate_license", API_URL))
        .json(&license)
        .send()
        .await.or_else(|_| Err(1))?;

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
    let json = serde_json::Value::from_str(license.unwrap().as_str()).unwrap();
    let client = Client::new();
    let res = client.post(format!("{}clear_license", API_URL))
        .json(&json!({
        "email": json["email"].as_str(),
        "key": json["key"].as_str()
    }))
        .send()
        .await.or_else(|_| Err(1))?;

    let stores = app.try_state::<StoreCollection<Wry>>().ok_or(1)?;
    let license = with_store(app.clone(), stores, PathBuf::from(App::name_store()), |store| {
        store.insert("license".to_string(), json!(null))?;
        store.save()?;
        Ok(true)
    });
    APPLICATION.lock().await.set_license(false);
    Ok(license.unwrap())
}