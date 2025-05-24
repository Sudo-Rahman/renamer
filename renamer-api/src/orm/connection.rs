use mongodb::{Client, Database as MongoDatabase};
use serde::{Serialize, Deserialize};
use crate::orm::error::{OrmError, Result};

#[derive(Clone)]
pub struct Database {
    client: Client,
    db: MongoDatabase,
}

impl Database {
    pub async fn connect(uri: &str, db_name: &str) -> Result<Self> {
        let client = Client::with_uri_str(uri).await
            .map_err(|e| OrmError::Connection(e.to_string()))?;

        let db = client.database(db_name);

        Ok(Database { client, db })
    }

    pub fn client(&self) -> &Client {
        &self.client
    }

    pub fn db(&self) -> &MongoDatabase {
        &self.db
    }

    // Ajouter les contraintes de traits requises
    pub fn collection<T>(&self, name: &str) -> mongodb::Collection<T>
    where
        T: Send + Sync + Serialize + for<'de> Deserialize<'de> + Unpin,
    {
        self.db.collection(name)
    }
}
