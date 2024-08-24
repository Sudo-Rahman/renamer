// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use crate::utils::{check_files_names, files_from_vec, list_files_in_directory, rename_files,get_system_language};

mod rename_file;
mod utils;

fn main() {
    tauri::Builder::default()
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
            get_system_language
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
