use serde::{Deserialize, Serialize};
use mongodb::bson::oid::ObjectId;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct BaseModel {
    #[serde(rename = "_id", skip_serializing_if = "Option::is_none")]
    pub id: Option<ObjectId>,
    // Utilisation directe de DateTime sans helper de sérialisation
    pub created_at: mongodb::bson::DateTime,
    pub updated_at: mongodb::bson::DateTime,
}

impl Default for BaseModel {
    fn default() -> Self {
        let now = mongodb::bson::DateTime::now();
        Self {
            id: None,
            created_at: now,
            updated_at: now,
        }
    }
}

impl BaseModel {
    pub fn new() -> Self {
        Self::default()
    }

    pub fn touch(&mut self) {
        self.updated_at = mongodb::bson::DateTime::now();
    }

    // Conversion helpers si vous voulez utiliser chrono
    pub fn created_at_chrono(&self) -> chrono::DateTime<chrono::Utc> {
        self.created_at.to_chrono()
    }

    pub fn updated_at_chrono(&self) -> chrono::DateTime<chrono::Utc> {
        self.updated_at.to_chrono()
    }

    pub fn set_created_at_chrono(&mut self, dt: chrono::DateTime<chrono::Utc>) {
        self.created_at = mongodb::bson::DateTime::from_chrono(dt);
    }

    pub fn set_updated_at_chrono(&mut self, dt: chrono::DateTime<chrono::Utc>) {
        self.updated_at = mongodb::bson::DateTime::from_chrono(dt);
    }
}
