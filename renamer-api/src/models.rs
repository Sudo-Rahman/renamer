use chrono::Utc;
use mongodb::bson::oid::ObjectId;
use mongodb::bson::{DateTime, Uuid};
use serde::{Deserialize, Serialize};
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
    pub(crate) machine_id: String,
}

#[derive(Deserialize, Serialize, Debug, Clone)]
pub struct Log {
    pub(crate) _id: ObjectId,
    pub(crate) date_time: DateTime,
    pub(crate) message: String,
}