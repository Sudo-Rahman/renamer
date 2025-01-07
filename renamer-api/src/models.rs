use crate::db::Mongo;
use axum::Json;
use chrono::Utc;
use mongodb::bson::oid::ObjectId;
use mongodb::bson::{bson, DateTime, Uuid};
use renamer_shared::{Machine, UserMachine};
use serde::{Deserialize, Serialize};
use serde_json::{json, Value};

#[derive(Clone)]
pub struct ServerConfig {
    pub db: Mongo,
}


#[derive(Deserialize, Serialize, Debug, Clone)]
pub struct User {
    pub _id: ObjectId,
    pub email: String,
    pub key: Uuid,
    pub plan: u8,
    pub machines: Vec<Machine>,
}

pub fn user_to_user_machine(user: User, machine: Machine) -> UserMachine {
    UserMachine {
        email: user.email,
        key: user.key,
        machine,
        plan: user.plan,
    }
}

#[derive(Deserialize, Serialize, Debug, Clone)]
pub struct Log {
    pub _id: ObjectId,
    pub date_time: DateTime,
    pub message: String,
}