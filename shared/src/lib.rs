use serde::{Deserialize, Serialize};
use mongodb::bson::{Uuid};

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
}