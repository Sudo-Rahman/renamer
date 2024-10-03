use axum::Json;
use chrono::Utc;
use mongodb::bson::oid::ObjectId;
use mongodb::bson::{DateTime, Uuid};
use serde::{Deserialize, Serialize};
use serde_json::{json, Value};
use crate::db::Mongo;

#[derive(Clone)]
pub(crate) struct ServerConfig {
    pub(crate) db: Mongo,
}


#[derive(Deserialize, Serialize, Debug, Clone)]
pub struct User {
    pub(crate) _id: ObjectId,
    pub(crate) email: String,
    pub(crate) key: Uuid,
    pub(crate) plan: u8,
    pub(crate) machines: Vec<Machine>,
}

#[derive(Deserialize, Serialize, Debug, Clone)]
pub struct Machine {
    pub(crate) id: String,
    pub(crate) device_name: String,
}

#[derive(Deserialize, Serialize, Debug, Clone)]
pub struct UserMachine {
    pub(crate) email: String,
    pub(crate) key: Uuid,
    pub(crate) machine: Machine,
}

#[derive(Deserialize, Serialize, Debug, Clone)]
pub struct Log {
    pub(crate) _id: ObjectId,
    pub(crate) date_time: DateTime,
    pub(crate) message: String,
}