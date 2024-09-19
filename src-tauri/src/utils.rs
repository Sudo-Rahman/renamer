use crate::rename_file::RenameFile;
use std::fs;
use std::path::Path;
use sys_locale::get_locale;

#[tauri::command]
pub async fn list_files_in_directory(dir: String) -> Result<Vec<RenameFile>, String> {
    let path = Path::new(&dir);

    if path.is_dir() {
        let mut files = Vec::new();
        for entry in fs::read_dir(path).map_err(|e| e.to_string())? {
            let entry = entry.map_err(|e| e.to_string())?;
            let path = entry.path();

            if path.is_file() {
                match RenameFile::new(path.to_string_lossy().to_string()) {
                    Ok(file) => files.push(file),
                    Err(err) => eprintln!("Error reading file metadata: {}", err),
                }
            }
        }
        Ok(files)
    } else {
        Err("The provided path is not a directory".to_string())
    }
}

#[tauri::command]
pub fn files_from_vec(files: Vec<String>) -> Result<Vec<RenameFile>, String> {
    let mut files_vec = Vec::new();
    for file in files {
        match RenameFile::new(file) {
            Ok(file) => files_vec.push(file),
            Err(err) => eprintln!("Error reading file metadata: {}", err),
        }
    }
    Ok(files_vec)
}

use serde::{Deserialize, Serialize};
use crate::app::APPLICATION;

#[derive(Debug, Deserialize, Serialize)]
pub struct FileRenameInfo {
    path: String,
    new_path: String,
    uuid: String, // ou un autre type de données
}

#[derive(Debug, Deserialize, Serialize)]
pub struct RenameStatus {
    status: bool,
    error: String,
    uuid: String, // ou un autre type de données
}

#[tauri::command]
pub async fn rename_files(file_infos: Vec<FileRenameInfo>) -> Result<Vec<RenameStatus>, i8> {
    if !APPLICATION.lock().await.license {
        return Err(1);
    }

    let mut vec = Vec::new();

    for FileRenameInfo {
        path,
        new_path,
        uuid,
    } in &file_infos
    {
        match fs::rename(path, new_path) {
            Ok(_) => {
                vec.push(RenameStatus {
                    status: true,
                    error: "".to_string(),
                    uuid: uuid.to_string(),
                });
            }
            Err(err) => {
                vec.push(RenameStatus {
                    status: false,
                    error: err.to_string(),
                    uuid: uuid.to_string(),
                });
                eprintln!("Error renaming file {}: {}", path, err);
            }
        }
    }

    Ok(vec)
}

#[derive(Debug, Deserialize, Serialize)]
pub struct FileStatus {
    uuid: String, // ou le type approprié pour uuid
    error: u8,
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

#[tauri::command]
pub fn get_system_language() -> String {
    get_locale()
        .unwrap_or_else(|| String::from("en-US"))
        .split('-')
        .next()
        .unwrap()
        .to_string()
}
