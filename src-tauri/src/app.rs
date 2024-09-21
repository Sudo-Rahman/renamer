#![allow(unused)]

use lazy_static::lazy_static;
use serde::{Deserialize, Serialize};
use std::string::ToString;
use std::sync::Arc;
use tokio::sync::Mutex;

#[derive(Clone, Deserialize, Serialize, Debug)]
pub(crate) struct User {
    pub(crate) license_key: String,
    pub(crate) email: String,
}

#[derive(Debug, Default)]
pub(crate) struct App {
    pub(crate) license: bool,
}

lazy_static! {
    pub(crate) static ref APPLICATION: Arc<Mutex<App>> = Arc::new(Mutex::new(App::default()));
}

impl App {
    pub(crate) fn set_license(&mut self, license: bool) {
        self.license = license;
    }

    pub(crate) fn name_store() -> String {
        "renamer".to_string()
    }
}
