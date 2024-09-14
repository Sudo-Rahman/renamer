#![allow(unused)]

use crate::models::User;
use mongodb::{Client, Collection, Database, error::Result, bson::*, bson, Cursor};
use std::env;
use dotenv::dotenv;
use futures::stream::{StreamExt, TryStreamExt};


#[derive(Clone)]
pub(crate) struct Mongo {
    client: Client,
    database: Database,
}

impl Mongo {
    pub(crate) async fn new() -> Result<Self> {
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

    pub async fn find_user_by_key(&self, key: &str) -> Result<Option<User>> {
        match self.database.collection::<User>("users").find_one(
            doc! {
                "key": key
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
}