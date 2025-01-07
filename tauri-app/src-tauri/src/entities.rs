use serde::{Deserialize, Serialize};
use std::time::{SystemTime, UNIX_EPOCH};
use uuid::Uuid;

#[derive(Debug, Deserialize, Serialize)]
pub struct RenameFile {
    path: String,
    name: String,
    size: u64,
    creation_date: u64,
    last_modified_date: u64,
    uuid: String,
}

impl RenameFile {
    // Méthode pour créer une nouvelle instance de RenameFile
    pub fn new(path: String) -> std::io::Result<Self> {
        let metadata = std::fs::metadata(&path)?;
        let name = std::path::Path::new(&path)
            .file_name()
            .and_then(|os_str| os_str.to_str())
            .unwrap_or("")
            .to_string();

        let size = metadata.len();
        let creation_date =
            Self::system_time_to_unix(metadata.created().unwrap_or(SystemTime::UNIX_EPOCH));
        let last_modified_date =
            Self::system_time_to_unix(metadata.modified().unwrap_or(SystemTime::UNIX_EPOCH));

        Ok(Self {
            path,
            name,
            size,
            creation_date,
            last_modified_date,
            uuid: Uuid::new_v4().to_string(),
        })
    }

    // Méthode pour convertir SystemTime en u64 (timestamp Unix en secondes)
    fn system_time_to_unix(time: SystemTime) -> u64 {
        time.duration_since(UNIX_EPOCH)
            .unwrap_or_default()
            .as_secs()
    }
}

#[derive(Debug, Deserialize, Serialize)]
pub struct FileRenameInfo {
    pub path: String,
    pub new_path: String,
    pub uuid: String, // ou un autre type de données
}

#[derive(Debug, Deserialize, Serialize)]
pub struct RenameStatus {
    pub status: bool,
    pub error: String,
    pub uuid: String, // ou un autre type de données
    pub new_path: String,
}


#[derive(Debug, Deserialize, Serialize)]
pub struct FileStatus {
    pub uuid: String, // ou le type approprié pour uuid
    pub error: u8,
}