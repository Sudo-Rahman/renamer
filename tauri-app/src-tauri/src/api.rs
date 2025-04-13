#![allow(unused)]

extern crate mid;
use crate::app::{APPLICATION};
use crate::store::{AppStore};
use reqwest::{Client, StatusCode};
use serde_json::{json, Value};
use std::str::FromStr;
use whoami;

use renamer_shared::UserMachine;
use tauri::{AppHandle, Manager};
use tauri_plugin_store::StoreExt;

#[cfg(debug_assertions)]
pub const API_URL: &str = "http://localhost:3000";

#[cfg(not(debug_assertions))]
pub const API_URL: &str = "https://api.renamer.pro";

pub async fn fetch_user_machine(mut user: &UserMachine) -> Result<(), String> {
    let client = Client::new();

    let res = client
        .post(format!("{}/get_user", API_URL))
        .json(&user)
        .send()
        .await
        .map_err(|e| e.to_string())?;


    if res.status().is_success() {
        let text = res.text().await.map_err(|e| e.to_string())?;
        let tmp = &serde_json::from_str::<UserMachine>(text.as_str()).map_err(|e| e.to_string())?;
        Ok(())
    } else {
        let error_text = res.text().await.map_err(|e| e.to_string())?;
        Err(error_text)
    }
}

#[tauri::command]
pub async fn get_license() -> Result<UserMachine, String> {
    let licence = AppStore::read::<UserMachine>("license");
    if licence.is_none() {
        return Err("No license found".to_string());
    }
    Ok(licence.unwrap())
}

#[tauri::command]
pub async fn save_license(user: UserMachine) -> bool {
    AppStore::write("license", json!(user));
    true
}

#[tauri::command]
pub async fn is_license_ok(app: tauri::AppHandle) -> Result<u8, i8> {
    let license = get_license().await;
    match license {
        Ok(license) => {
            if (online::check(None).is_ok()) {
                let res = fetch_user_machine(&license).await;
                match res {
                    Ok(res) => {
                        AppStore::write("presets", json!(license.presets));
                        Ok(license.plan)
                    }
                    Err(_) => {
                        if license.machine.id == get_machine_id() { Ok(1) } else { Err(5) }
                    }
                }
            } else {
                Ok(if license.machine.id == get_machine_id() { 1 } else { 0 })
            }
        }
        Err(_) => Err(1),
    }
}

#[tauri::command]
pub async fn activate_license(app: tauri::AppHandle, key: String) -> Result<bool, i8> {
    let application = APPLICATION.clone();
    application.lock().await.set_license(0);
    let client = Client::new();

    let license = json!({
       "key" : key,
        "machine" : json!({
            "id" : get_machine_id(),
            "device_name" : whoami::devicename().unwrap_or("Unknown".to_string()),
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
        let user: UserMachine = serde_json::from_str(text.unwrap().as_str()).unwrap();
        save_license(user.clone()).await;
        application.lock().await.set_license(user.plan);
        Ok(true)
    } else if res.status() == StatusCode::UNAUTHORIZED {
        Err(2)
    } else {
        Err(1)
    }
}

pub fn get_machine_id() -> String {
    mid::get("383441314b796e4723444550584a656d664056436566442e5b2532655b44473e23436273713345794558572855547140545766344545735b70786e6a30364250").unwrap()
}

#[tauri::command]
pub async fn remove_license(app: tauri::AppHandle) -> Result<bool, i8> {
    let license = get_license().await;
    if license.is_err() {
        return Err(1);
    }
    let client = Client::new();
    let res = client
        .post(format!("{}/remove_machine", API_URL))
        .json(&license)
        .send()
        .await
        .or_else(|_| Err(1))?;

    AppStore::clear();
    APPLICATION.lock().await.set_license(0);
    Ok(true)
}

#[tauri::command]
pub async fn save_presets(app: tauri::AppHandle) -> Result<(), u8> {
    let presets = AppStore::read::<String>("presets").unwrap_or("".to_string());

    let user_machine = get_license().await.unwrap();

    let json = json!({
        "key" : user_machine.key,
        "presets" : serde_json::from_str::<Value>(presets.as_str()).unwrap()
    });

    let client = Client::new();

    let res = client
        .post(format!("{}/save_presets", API_URL))
        .json(&json)
        .send()
        .await
        .or_else(|_| Err(3))?;

    if res.status().is_success() {
        Ok(())
    } else {
        Err(4)
    }
}