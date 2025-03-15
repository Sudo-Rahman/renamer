use mongodb::bson::Uuid;
use serde::{Deserialize, Serialize};

#[derive(Deserialize, Serialize, Debug, Clone)]
pub struct Machine {
    pub id: String,
    pub device_name: String,
}

#[derive(Deserialize, Serialize, Debug, Clone)]
pub struct UserMachine {
    pub email: String,
    pub key: Uuid,
    pub machine: Machine,
    #[serde(default)]
    pub plan: u8,
    #[serde(default)]
    pub presets: String,
}