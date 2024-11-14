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
pub(crate) struct User {
    pub(crate) license_key: String,
    pub(crate) email: String,
}

#[derive(Debug, Deserialize, Serialize)]
pub(crate) struct App {
    license: bool,
    store_name: String,
}

lazy_static! {
    pub(crate) static ref APPLICATION: Arc<Mutex<App>> = Arc::new(Mutex::new(App::default()));
}

impl App {
    pub(crate) fn set_license(&mut self, license: bool) {
        self.license = license;
    }

    pub(crate) fn license(&mut self) -> bool {
        self.license
    }

    pub(crate) async fn get_store(&mut self, app: tauri::AppHandle) -> tauri_plugin_store::Result<Arc<Store<Wry>>> {
        let store_name = self.store_name.clone();
        app.store(store_name)
    }
}

impl Default for App {
    fn default() -> Self {
        App {
            license: false,
            store_name: "renamer_store.json".to_string(),
        }
    }
}