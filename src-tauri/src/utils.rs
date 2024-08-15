use std::fs;
use std::path::{Path};
use crate::rename_file::RenameFile;

#[tauri::command]
pub fn list_files_in_directory(dir: String) -> Result<Vec<RenameFile>, String> {
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

#[derive(Debug, Deserialize, Serialize)]
pub struct FileRenameInfo<'a> {
    path: &'a str,
    new_path: &'a str,
}

#[tauri::command]
pub fn rename_files(file_infos: Vec<FileRenameInfo<'_>>) -> Result<Vec<&str>, String> {
    let mut errors = Vec::new();

    for FileRenameInfo { path, new_path } in file_infos {
        match fs::rename(path, new_path) {
            Ok(_) => {}
            Err(err) => {
                errors.push(path);
                eprintln!("Error renaming file {}: {}", path, err);
            }
        }
    }

    Ok(errors)
}