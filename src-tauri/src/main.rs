// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use crate::app::App;

mod rename_file;
mod utils;
mod auth;
mod app;

fn main() {
    App::new();
}
