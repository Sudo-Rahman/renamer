use crate::entities::*;
use std::fs;
use std::path::Path;
use sys_locale::get_locale;

#[tauri::command]
pub async fn list_files_in_directory(dir: String) -> Result<Value, String> {
    let path = Path::new(&dir);

    if path.is_dir() {
        let mut files = Vec::new();
        for entry in fs::read_dir(path).map_err(|e| e.to_string())? {
            let entry = entry.map_err(|e| e.to_string())?;
            let path = entry.path();
            if path.file_name().unwrap().to_str().unwrap().starts_with(".") {
                continue;
            }

            if path.is_file() {
                match RenameFile::new(path.to_string_lossy().to_string()) {
                    Ok(file) => files.push(file),
                    Err(err) => eprintln!("Error reading file metadata: {}", err),
                }
            }
        }

        let plan = APPLICATION.lock().await.license();
        // no licence max 5 files
        if plan == 0 {
            files.truncate(5);
        }
        Ok(json!({
            "files": files,
            "plan": plan
        }))
    } else {
        Err("The provided path is not a directory".to_string())
    }
}

#[tauri::command]
pub async fn files_from_vec(files: Vec<String>) -> Result<Value, String> {
    let mut files_vec = Vec::new();
    let binding = files.first().unwrap();
    let dir = Path::new(&binding).parent().unwrap();
    for file in &files {
        let path = Path::new(file);
        if path.is_file() && path.parent().unwrap() == dir {
            match RenameFile::new(path.to_string_lossy().to_string()) {
                Ok(file) => files_vec.push(file),
                Err(err) => eprintln!("Error reading file metadata: {}", err),
            }
        }
    }

    let plan = APPLICATION.lock().await.license();
    // no licence max 5 files
    if plan == 0 {
        files_vec.truncate(5);
    }
    Ok(json!({
            "files": files_vec,
            "plan": plan
        }))
}

use crate::app::APPLICATION;
use serde_json::{json, Value};

#[tauri::command]
pub async fn rename_files(file_infos: Vec<FileRenameInfo>) -> Result<Vec<RenameStatus>, i8> {
    let mut vec = Vec::new();

    for FileRenameInfo {
        path,
        new_path,
        uuid,
    } in &file_infos
    {
        match fs::rename(path, new_path) {
            Ok(()) => {
                vec.push(RenameStatus {
                    status: true,
                    error: "".to_string(),
                    uuid: uuid.to_string(),
                    new_path: new_path.to_string(),
                });
            }
            Err(err) => {
                vec.push(RenameStatus {
                    status: false,
                    error: err.to_string(),
                    uuid: uuid.to_string(),
                    new_path: new_path.to_string(),
                });
                eprintln!("Error renaming file {}: {}", path, err);
            }
        }
    }

    Ok(vec)
}

// check file name is unique in the directory
#[tauri::command]
pub async fn check_files_names(files: Vec<FileRenameInfo>) -> Result<Vec<FileStatus>, String> {
    if files.is_empty() {
        return Ok(Vec::new());
    }

    let mut files_vec = Vec::new();
    let mut files_in_dir = Vec::new();
    let dir = Path::new(&files.first().unwrap().path).parent().unwrap();

    if dir.is_dir() {
        for entry in fs::read_dir(dir).map_err(|e| e.to_string())? {
            let entry = entry.map_err(|e| e.to_string())?;
            let path = entry.path();

            if path.is_file() {
                files_in_dir.push(path.to_string_lossy().to_string());
            }
        }
    } else {
        return Err("The provided path is not a directory".to_string());
    }

    for FileRenameInfo { new_path, uuid, .. } in &files {
        if files_in_dir.contains(&new_path.to_string()) {
            files_vec.push(FileStatus {
                uuid: (*uuid).parse().unwrap(),
                error: 1,
            });
        }
    }

    // compare the files names between them
    for FileRenameInfo { new_path, uuid, .. } in &files {
        for FileRenameInfo {
            new_path: new_path2,
            uuid: uuid2,
            ..
        } in &files
        {
            if *new_path == *new_path2 && *uuid != *uuid2 {
                files_vec.push(FileStatus {
                    uuid: (*uuid).parse().unwrap(),
                    error: 1,
                });
                break;
            }
        }
    }

    for file in &files {
        if !Path::new(&file.path).exists() {
            files_vec.push(FileStatus {
                uuid: file.uuid.parse().unwrap(),
                error: 2,
            });
        }
    }

    Ok(files_vec)
}

const LOCAL: fn() -> String = || {
    return get_locale()
        .unwrap_or_else(|| String::from("en-US"))
        .split('-')
        .next()
        .unwrap()
        .to_string();
};
#[tauri::command]
pub async fn get_system_language(app: tauri::AppHandle) -> String {
    let store = APPLICATION.lock().await.get_store(app.clone()).await;
    if store.is_err() {
        return LOCAL();
    }

    let lang = store.unwrap().get("lang");
    match lang {
        Some(lang) => lang.as_str().unwrap().to_string(),
        None => LOCAL()
    }
}

#[tauri::command]
pub async fn set_system_language(app: tauri::AppHandle, lang: String) -> Result<bool, i8> {
    let store = APPLICATION.lock().await.get_store(app.clone()).await;
    if store.is_err() {
        return Err(1);
    }
    store.unwrap().set("lang".to_string(), json!(lang));

    Ok(true)
}

#[tauri::command]
pub async fn open_browser_url(url: &str) -> Result<(), String> {
    if webbrowser::open(url).is_ok() {
        Ok(())
    } else {
        Err("Failed to open the browser".to_string())
    }
}