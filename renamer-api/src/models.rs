use axum::Json;
use chrono::Utc;
use mongodb::bson::oid::ObjectId;
use mongodb::bson::{bson, DateTime, Uuid};
use serde::{Deserialize, Serialize};
use serde_json::{json, Value};
use renamer_shared::{Machine, UserMachine};
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

pub(crate) fn user_to_user_machine(user: User, machine: Machine) -> UserMachine {
    UserMachine {
        email: user.email,
        key: user.key,
        machine,
    }
}

#[derive(Deserialize, Serialize, Debug, Clone)]
pub(crate) struct Log {
    pub _id: ObjectId,
    pub date_time: DateTime,
    pub message: String,
}