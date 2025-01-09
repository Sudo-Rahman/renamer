#![allow(unused)]

use crate::models::{Log, User};
use renamer_shared::Machine;
use mongodb::{Client, Collection, Database, error::Result, bson::*, bson, Cursor};
use std::env;
use dotenv::dotenv;
use futures::stream::{StreamExt, TryStreamExt};
use serde_json::{json, Map, Value};
use crate::utils;

#[derive(Clone)]
pub struct Mongo {
    client: Client,
    database: Database,
}

impl Mongo {
    pub async fn new() -> Result<Self> {
        dotenv().ok();

        // Replace the placeholder with your Atlas connection string
        let uri = env::var("MONGO_URI").unwrap_or_else(|_| {
            eprintln!("MONGO_URI must be set");
            std::process::exit(1);
        });
        // Create a new client and connect to the server
        let client = Client::with_uri_str(uri).await?;
        // Get a handle on the movies collection
        let database = client.database("renamer");

        Ok(Self { client, database })
    }

    pub async fn insert_user(&self, user: &User) -> Result<(Bson)> {
        match self.database.collection::<User>("users").insert_one(user).await {
            Ok(response) => Ok(response.inserted_id),
            Err(e) => Err(e),
        }
    }

    pub async fn find_user(&self, data: &Document) -> Result<Option<User>> {
        match self.database.collection::<User>("users").find_one(
            data.clone(),
        ).await {
            Ok(response) => Ok(response),
            Err(e) => {
                eprintln!("Failed to find user: {}", e);
                Err(e)
            }
        }
    }

    pub async fn modify_user(&self, user: &User) -> Result<()> {
        match self.database.collection::<User>("users").replace_one(
            doc! {
                "key": Uuid::parse_str(&user.key.to_string()).unwrap()
            },
            user,
        ).await {
            Ok(_) => Ok(()),
            Err(e) => {
                eprintln!("Failed to update user: {}", e);
                Err(e)
            }
        }
    }

    pub async fn find_user_by_email(&self, email: &str) -> Result<Option<User>> {
        match self.database.collection::<User>("users").find_one(
            doc! {
                "email": email
            },
        ).await {
            Ok(response) => Ok(response),
            Err(e) => Err(e),
        }
    }

    pub async fn find_all_users(&self) -> Result<Vec<User>> {
        let collection = self.database.collection::<User>("users");


        // Collecter les résultats dans un vecteur
        let mut cursor = match collection.find(Document::new()).await {
            Ok(cursor) => cursor,
            Err(_) => return Err(mongodb::error::Error::from(std::io::Error::new(std::io::ErrorKind::Other, "Failed to find users"))),
        };
        let vec = cursor.try_collect::<Vec<User>>().await?;

        Ok(vec)
    }

    pub async fn update_machines(&self, doc: &Document, machines: &Vec<Machine>) -> Result<()> {
        match self.database.collection::<User>("users").update_one(
            doc.clone(),
            doc! {
                "$set": {
                    "machines": to_bson(&machines)?
                }
            },
        ).await {
            Ok(_) => Ok(()),
            Err(e) => Err(e),
        }
    }

    pub async fn activate_licence(&self, user: &User) -> Result<()> {
        match self.database.collection::<User>("users").update_one(
            doc! {
                "key": &user.key,
                "email": &user.email
            },
            doc! {
                "$set": {
                    "machines": to_bson(&user.machines)?
                }
            },
        ).await {
            Ok(_) => Ok(()),
            Err(e) => Err(e),
        }
    }

    pub async fn insert_log(&self, log: Log) -> Result<()> {
        utils::insert_log(log.clone()).await;
        match self.database.collection::<Log>("logs").insert_one(
            log.clone(),
        ).await {
            Ok(_) => Ok(()),
            Err(e) => {
                eprintln!("Failed to insert log: {}", e);
                Err(e)
            }
        }
    }

    pub async fn get_all_logs(&self) -> Result<Vec<Log>> {
        let collection = self.database.collection::<Log>("logs");

        // Collecter les résultats dans un vecteur
        let mut cursor = match collection.find(Document::new()).await {
            Ok(cursor) => cursor,
            Err(_) => return Err(mongodb::error::Error::from(std::io::Error::new(std::io::ErrorKind::Other, "Failed to find logs"))),
        };
        let vec = cursor.try_collect::<Vec<Log>>().await?;

        Ok(vec)
    }
}