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

    // Méthode helper pour accéder à l'ORM Database
    pub fn get_orm_db(&self) -> &Database {
        &self.orm_db
    }
}
