// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
extern crate core;

mod app;
mod api;
mod entities;
mod utils;

use crate::app::APPLICATION;
use crate::api::*;
use crate::utils::*;

fn main() {
    tauri::Builder::default()
        .setup(setup)
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
            save_license,
            is_license_ok,
            activate_license,
            remove_license,
            set_system_language,
            open_browser_url,
            save_presets
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

fn setup<'a>(app: &'a mut tauri::App) -> Result<(), Box<dyn std::error::Error>> {
    let handle = app.handle().clone();

    tauri::async_runtime::spawn(async move {
        let license_result = is_license_ok(handle).await;
        let application = APPLICATION.clone();
        if let Ok(plan) = license_result {
            application.lock().await.set_license(plan);
        } else {
            application.lock().await.set_license(0);
        }
    });
    Ok(())
}
