use mongodb::bson::oid::ObjectId;
use mongodb::bson::Uuid;
use serde::{Deserialize, Serialize};
use crate::db::Mongo;

#[derive(Clone)]
pub struct ServerConfig {
    pub(crate) db: Mongo,
}


#[derive(Deserialize, Serialize, Debug, Clone)]
pub struct User {
    pub(crate) _id: ObjectId,
    pub(crate) email: String,
    pub(crate) key: Uuid,
    pub(crate) used: bool,
}