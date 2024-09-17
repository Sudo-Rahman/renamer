#![allow(unused)]

use tauri::Manager;
use crate::utils::*;
use crate::auth::*;

pub(crate) struct User {
    pub(crate) license_key: String,
    pub(crate) email: String,
}
pub(crate) struct App {}

impl App {
    pub fn new() -> Self {
        tauri::Builder::default()
            .plugin(tauri_plugin_http::init())
            .plugin(tauri_plugin_process::init())
            .plugin(tauri_plugin_updater::Builder::new().build())
            .plugin(tauri_plugin_store::Builder::new().build())
            .plugin(tauri_plugin_dialog::init())
            .plugin(tauri_plugin_fs::init())
            .plugin(tauri_plugin_shell::init())
            .plugin(tauri_plugin_os::init())
            .invoke_handler(tauri::generate_handler![
            list_files_in_directory,
            files_from_vec,
            rename_files,
            check_files_names,
            get_system_language,
            check_licence,
            get_license,
            save_license
        ])
            .run(tauri::generate_context!())
            .expect("error while running tauri application");
        App {}
    }
}
