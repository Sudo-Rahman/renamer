use std::fmt::Debug;
use serde_json::Value;
use std::sync::{Arc, OnceLock};
use tauri::{Manager, Wry};
use tauri_plugin_store::{Store, StoreExt};

pub struct AppStore {
    app: tauri::AppHandle,
    store: Arc<Store<Wry>>,
}


static APPSTORE: OnceLock<AppStore> = OnceLock::new();

impl AppStore {
    pub fn read<T>(key: &str) -> Option<T>
    where
        T: serde::de::DeserializeOwned + Send + 'static + Debug,
    {
        let app_store = APPSTORE.get().expect("AppStore not initialized");
        let value = app_store.store.get(key);
        if value.is_none() {
            return None;
        }

        let binding = value.unwrap();
        match serde_json::from_value::<T>(binding) {
            Ok(v) => Some(v),
            Err(e) => {
                println!("error reading store {:?} error : {:?}", key, e);
                None
            }
        }
    }

    pub fn write(key: &str, value: Value) -> bool
    {
        let app_store = APPSTORE.get().expect("AppStore not initialized");
        app_store.store.set(key, value);
        app_store.store.save().expect("Failed to save store");
        true
    }

    pub fn clear() {
        let app_store = APPSTORE.get().expect("AppStore not initialized");
        app_store.store.clear();
        app_store.store.save().expect("Failed to save store");
    }

    pub fn init(app: tauri::AppHandle) {
        APPSTORE.get_or_init(|| {
            AppStore {
                app: app.clone(),
                store: app.clone().store("renamer_store.json").unwrap(),
            }
        });
    }
}

