#![allow(unused)]

use crate::models::{Log, User};
use crate::orm::{Database, Result as OrmResult};
use renamer_shared::Machine;
use mongodb::{Client, error::Result, bson::*, bson};
use std::env;
use dotenv::dotenv;
use serde_json::{json, Map, Value};
use crate::utils;

#[derive(Clone)]
pub struct Mongo {
    pub orm_db: Database, // Utilise l'ORM Database
}

impl Mongo {
    pub async fn new() -> Result<Self> {
        dotenv().ok();
        let uri = env::var("MONGO_URI").unwrap_or_else(|_| {
            eprintln!("MONGO_URI must be set");
            std::process::exit(1);
        });

        // Utilise l'ORM Database
        let orm_db = Database::connect(&uri, "renamer").await
            .map_err(|e| mongodb::error::Error::from(std::io::Error::new(
                std::io::ErrorKind::Other,
                format!("ORM connection failed: {}", e)
            )))?;

        Ok(Self { orm_db })
    }

    // Méthodes User avec ORM
    pub async fn insert_user(&self, user: &User) -> Result<Bson> {
        use crate::orm::Model;
        let mut user_clone = user.clone();
        user_clone.save(&self.orm_db).await
            .map_err(|e| mongodb::error::Error::from(std::io::Error::new(
                std::io::ErrorKind::Other,
                format!("Failed to save user: {}", e)
            )))?;

        Ok(Bson::ObjectId(user_clone.id().unwrap().clone()))
    }

    pub async fn find_user(&self, data: &Document) -> Result<Option<User>> {
        use crate::orm::Collection;
        User::find_one_by_filter(&self.orm_db, data.clone()).await
            .map_err(|e| mongodb::error::Error::from(std::io::Error::new(
                std::io::ErrorKind::Other,
                format!("Failed to find user: {}", e)
            )))
    }

    pub async fn find_user_by_email(&self, email: &str) -> Result<Option<User>> {
        User::find_by_email(&self.orm_db, email).await
            .map_err(|e| mongodb::error::Error::from(std::io::Error::new(
                std::io::ErrorKind::Other,
                format!("Failed to find user by email: {}", e)
            )))
    }

    pub async fn find_all_users(&self) -> Result<Vec<User>> {
        use crate::orm::Collection;
        User::find_all(&self.orm_db).await
            .map_err(|e| mongodb::error::Error::from(std::io::Error::new(
                std::io::ErrorKind::Other,
                format!("Failed to find all users: {}", e)
            )))
    }

    pub async fn modify_user(&self, user: &User) -> Result<()> {
        use crate::orm::Model;
        let mut user_clone = user.clone();
        user_clone.save(&self.orm_db).await
            .map_err(|e| mongodb::error::Error::from(std::io::Error::new(
                std::io::ErrorKind::Other,
                format!("Failed to modify user: {}", e)
            )))
    }

    pub async fn activate_licence(&self, user: &User) -> Result<()> {
        self.modify_user(user).await
    }

    pub async fn update_machines(&self, filter_doc: &Document, machines: &Vec<Machine>) -> Result<()> {
        // Trouve l'utilisateur, met à jour ses machines et sauvegarde
        if let Some(mut user) = self.find_user(filter_doc).await? {
            user.machines = machines.clone();
            user.touch();
            self.modify_user(&user).await
        } else {
            Err(mongodb::error::Error::from(std::io::Error::new(
                std::io::ErrorKind::NotFound,
                "User not found for machine update"
            )))
        }
    }

    // Méthodes Log avec ORM
    pub async fn insert_log(&self, log: Log) -> Result<()> {
        use crate::orm::Model;
        let mut log_clone = log.clone();

        // Sauvegarde dans le fichier (fonction existante)
        utils::insert_log(log.clone()).await;

        // Sauvegarde avec ORM
        log_clone.save(&self.orm_db).await
            .map_err(|e| mongodb::error::Error::from(std::io::Error::new(
                std::io::ErrorKind::Other,
                format!("Failed to insert log: {}", e)
            )))
    }

    pub async fn get_all_logs(&self) -> Result<Vec<Log>> {
        use crate::orm::Collection;
        Log::find_all(&self.orm_db).await
            .map_err(|e| mongodb::error::Error::from(std::io::Error::new(
                std::io::ErrorKind::Other,
                format!("Failed to get all logs: {}", e)
            )))
    }

    // Méthode helper pour accéder à l'ORM Database
    pub fn get_orm_db(&self) -> &Database {
        &self.orm_db
    }
}
