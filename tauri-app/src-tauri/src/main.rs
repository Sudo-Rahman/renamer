// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
extern crate core;
#[macro_use]
extern crate rust_i18n;

mod app;
mod api;
mod entities;
mod utils;
mod store;
mod window;
mod updater;

use crate::api::*;
use crate::app::APPLICATION;
use crate::store::*;
use crate::utils::*;
use crate::updater::*;

use rust_i18n::i18n;
use crate::window::create_main_window;

i18n!("locales");

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
            get_license,
            save_license,
            is_license_ok,
            activate_license,
            remove_license,
            set_system_language,
            open_browser_url,
            save_presets,
            get_app,
            get_languages_data,
            download_and_install_update
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

fn setup<'a>(app: &'a mut tauri::App) -> Result<(), Box<dyn std::error::Error>> {
    let handle_clone1 = app.handle().clone();

    AppStore::init(handle_clone1.clone());


    tauri::async_runtime::spawn(async move {
        APPLICATION.lock().await.init_values(handle_clone1.clone()).await;
        rust_i18n::set_locale(&get_system_language().await);
        check_update(handle_clone1.clone(), || {
            create_main_window(handle_clone1.clone());
        }).await.inspect_err(|_| {
            create_main_window(handle_clone1.clone());
        }).expect("error checking update");
    });


    let handle_clone2 = app.handle().clone();
    tauri::async_runtime::spawn(async move {
        let license_result = is_license_ok(handle_clone2.clone()).await;
        let application = APPLICATION.clone();
        if let Ok(plan) = license_result {
            application.lock().await.set_license(plan);
        } else {
            application.lock().await.set_license(0);
        }
    });
    Ok(())
}
