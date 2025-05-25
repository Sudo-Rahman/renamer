use std::collections::HashMap;
use crate::orm::{Model, Collection, Database, BaseModel, HasBaseModel};
use mongodb::bson::{DateTime, Uuid};
use renamer_shared::{Machine, UserMachine};
use serde::{Deserialize, Serialize};
use serde_json::{json, Value};
use async_trait::async_trait;
use bson::{doc, Bson};

#[derive(Clone)]
pub struct ServerConfig {
    pub db: Database, // Changé de Mongo vers Database (ORM)
    pub token: String,
}

#[derive(Deserialize, Serialize, Debug, Clone)]
pub struct User {
    #[serde(flatten)]
    pub base: BaseModel,
    pub email: String,
    pub key: Uuid,
    pub plan: u8,
    pub machines: Vec<Machine>,
    pub presets: Value,
}

impl HasBaseModel for User {
    fn base(&self) -> &BaseModel {
        &self.base
    }

    fn base_mut(&mut self) -> &mut BaseModel {
        &mut self.base
    }
}


impl User {
    pub fn new(email: String, plan: u8) -> Self {
        Self {
            base: Default::default(),
            email,
            key: Uuid::new(),
            plan,
            machines: vec![],
            presets: json!([]),
        }
    }
    
    // Méthodes spécifiques au modèle User
    pub async fn find_by_email(db: &Database, email: &str) -> crate::orm::Result<Option<User>> {
        use mongodb::bson::doc;
        let filter = doc! { "email": email };
        User::find_one_by_filter(db, filter).await
    }

    pub async fn find_by_key(db: &Database, key: &Uuid) -> crate::orm::Result<Option<User>> {
        use mongodb::bson::doc;
        let filter = doc! { "key": key };
        User::find_one_by_filter(db, filter).await
    }

    pub async fn find_by_email_and_key(db: &Database, email: &str, key: &Uuid) -> crate::orm::Result<Option<User>> {
        use mongodb::bson::doc;
        let filter = doc! {
            "email": email,
            "key": key
        };
        User::find_one_by_filter(db, filter).await
    }

    pub fn has_machine(&self, machine_id: &str) -> bool {
        self.machines.iter().any(|m| m.id == machine_id)
    }

    pub fn add_machine(&mut self, machine: Machine) -> Result<(), String> {
        // Vérifications selon le plan
        match self.plan {
            0 => {
                if !self.machines.is_empty() {
                    return Err("User already has a machine".to_string());
                }
            }
            1 => {
                if self.machines.len() >= 5 {
                    return Err("User already has 5 machines".to_string());
                }
                if self.has_machine(&machine.id) {
                    return Err("Machine already exists".to_string());
                }
            }
            _ => return Err("Invalid plan".to_string()),
        }

        self.machines.push(machine);
        self.touch();
        Ok(())
    }

    pub fn remove_machine(&mut self, machine_id: &str) -> Result<(), String> {
        if !self.has_machine(machine_id) {
            return Err("Machine not found".to_string());
        }

        self.machines.retain(|m| m.id != machine_id);
        self.touch();
        Ok(())
    }

    pub fn update_presets(&mut self, presets: Value) {
        self.presets = presets;
        self.touch();
    }
}

#[async_trait]
impl Model for User {
    fn collection_name() -> &'static str {
        "users"
    }
    
    fn default_values() -> HashMap<String, Bson> {
        let mut defaults = HashMap::new();
        let now = DateTime::now();

        defaults.insert("created_at".to_string(), Bson::DateTime(now));
        defaults.insert("updated_at".to_string(), Bson::DateTime(now));
        defaults.insert("plan".to_string(), Bson::Int32(0));
        defaults.insert("machines".to_string(), Bson::Array(vec![]));
        defaults.insert("presets".to_string(), Bson::Document(doc! {}));
        defaults.insert("key".to_string(), Bson::String(mongodb::bson::Uuid::new().to_string()));

        defaults
    }

    fn array_field_defaults() -> HashMap<String, HashMap<String, Bson>> {
        let mut defaults = HashMap::new();
        defaults.insert("machines".to_string(), HashMap::new());
        defaults
    }

    fn required_fields() -> Vec<String> {
        vec![
            "email".to_string(),
            "key".to_string(),
            "plan".to_string(),
            "machines".to_string(),
            "created_at".to_string(),
            "updated_at".to_string()
        ]
    }
}

impl Collection<User> for User {}

#[derive(Deserialize, Serialize, Debug, Clone)]
pub struct Log {
    #[serde(flatten)]
    pub base: BaseModel,
    pub message: String,
}

impl HasBaseModel for Log {
    fn base(&self) -> &BaseModel {
        &self.base
    }

    fn base_mut(&mut self) -> &mut BaseModel {
        &mut self.base
    }
}

impl Log {
    pub fn new(message: String) -> Self {
        Self {
            base: Default::default(),
            message,
        }
    }

    pub async fn find_recent(db: &Database, limit: i64) -> crate::orm::Result<Vec<Log>> {
        use mongodb::bson::doc;
        use mongodb::options::FindOptions;

        let collection = db.collection::<Log>(Log::collection_name());
        let options = FindOptions::builder()
            .sort(doc! { "date_time": -1 })
            .limit(limit)
            .build();

        let mut cursor = collection.find(doc! {}).with_options(options).await?;
        let mut results = Vec::new();

        use futures::stream::StreamExt;
        while let Some(result) = cursor.next().await {
            results.push(result?);
        }
        Ok(results)
    }

    pub async fn find_by_date_range(
        db: &Database,
        start: DateTime,
        end: DateTime
    ) -> crate::orm::Result<Vec<Log>> {
        use mongodb::bson::doc;
        let filter = doc! {
            "date_time": {
                "$gte": start,
                "$lte": end
            }
        };
        Log::find_by_filter(db, filter).await
    }
}

#[async_trait]
impl Model for Log {
    fn collection_name() -> &'static str {
        "logs"
    }
    
    fn default_values() -> HashMap<String, Bson> {
        let mut defaults = HashMap::new();
        let now = DateTime::now();

        defaults.insert("date_time".to_string(), Bson::DateTime(now));
        defaults.insert("created_at".to_string(), Bson::DateTime(now));
        defaults.insert("updated_at".to_string(), Bson::DateTime(now));

        defaults
    }

    fn required_fields() -> Vec<String> {
        vec![
            "message".to_string(),
            "date_time".to_string()
        ]
    }
}

impl Collection<Log> for Log {}

// Fonction helper pour la conversion
pub fn user_to_user_machine(user: User, machine: Machine) -> UserMachine {
    UserMachine {
        email: user.email,
        key: user.key,
        machine,
        plan: user.plan,
        presets: user.presets,
    }
}
