#![allow(unused)]

use crate::auth::get_license;
use lazy_static::lazy_static;
use serde::{Deserialize, Serialize};
use std::string::ToString;
use std::sync::Arc;
use reqwest::Body;
use tauri::Wry;
use tauri_plugin_store::{Store, StoreExt};
use tokio::sync::Mutex;

#[derive(Clone, Deserialize, Serialize, Debug)]
pub struct User {
    pub license_key: String,
    pub email: String,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct App {
    plan: u8,
    store_name: String,
}

lazy_static! {
    pub static ref APPLICATION: Arc<Mutex<App>> = Arc::new(Mutex::new(App::default()));
}

impl App {
    pub fn set_license(&mut self, plan: u8) {
        self.plan = plan;
    }

    pub fn license(&mut self) -> u8 {
        self.plan
    }

    pub fn have_license(&mut self) -> bool {
        self.plan > 0
    }

    pub async fn get_store(&mut self, app: tauri::AppHandle) -> tauri_plugin_store::Result<Arc<Store<Wry>>> {
        let store_name = self.store_name.clone();
        app.store(store_name)
    }
}

impl Default for App {
    fn default() -> Self {
        App {
            plan: 0,
            store_name: "renamer_store.json".to_string(),
        }
    }
}