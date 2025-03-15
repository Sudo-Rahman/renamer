#![allow(unused)]

use crate::store::AppStore;
use lazy_static::lazy_static;
use serde::{Deserialize, Serialize};
use std::string::ToString;
use std::sync::Arc;
use serde_json::Value;
use tauri_plugin_store::StoreExt;
use tokio::sync::Mutex;

#[derive(Clone, Deserialize, Serialize, Debug)]
pub struct User {
    pub license_key: String,
    pub email: String,
}

#[derive(Debug, Deserialize, Serialize, Clone)]
pub struct App {
    plan: u8,
    check_update: bool,
    version: String,
    new_version: Option<String>,
    language: String,
}


lazy_static! {
    pub static ref APPLICATION: Arc<Mutex<App>> = Arc::new(Mutex::new(App::default()));
}

impl App {
    pub fn set_license(&mut self, plan: u8) {
        self.plan = plan;
    }

    pub fn version(&mut self) -> String {
        self.version.clone()
    }

    pub fn license(&mut self) -> u8 {
        self.plan
    }

    pub fn have_license(&mut self) -> bool {
        self.plan > 0
    }

    pub async fn init_values(&mut self, app: tauri::AppHandle) {
        let check_update = AppStore::read::<bool>("check_update").unwrap_or(true);
        self.check_update = check_update;
    }

    pub fn set_check_update(&mut self, check_update: bool) {
        self.check_update = check_update;
    }

    pub fn set_new_version(&mut self, version: String) {
        self.new_version = Some(version);
    }

    pub fn new_version_available(&self) -> bool {
        self.new_version.is_some()
    }

    pub fn check_update(&self) -> bool {
        self.check_update
    }
}

impl Default for App {
    fn default() -> Self {
        App {
            plan: 0,
            check_update: true,
            new_version: None,
            language: "en".to_string(),
            version: env!("CARGO_PKG_VERSION").parse().unwrap(),
        }
    }
}