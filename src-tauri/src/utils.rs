use std::fs;
use std::path::{Path};

#[tauri::command]
pub fn list_files_in_directory(dir: String) -> Result<Vec<String>, String> {
    let path = Path::new(&dir);

    if path.is_dir() {
        let mut files = Vec::new();
        for entry in fs::read_dir(path).map_err(|e| e.to_string())? {
            let entry = entry.map_err(|e| e.to_string())?;
            let path = entry.path();

            if path.is_file() {
                if let Some(path_str) = path.to_str() {
                    files.push(path_str.to_string());
                }
            }
        }
        Ok(files)
    } else {
        Err("The provided path is not a directory".to_string())
    }
}