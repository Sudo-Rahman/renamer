use async_trait::async_trait;
use mongodb::bson::{doc, Document, oid::ObjectId};
use serde::{Deserialize, Serialize};
use crate::orm::{Database, Result, OrmError};
use futures::stream::StreamExt;

#[async_trait]
pub trait Model: Serialize + for<'de> Deserialize<'de> + Send + Sync + Unpin + Clone {
    fn collection_name() -> &'static str;

    fn id(&self) -> Option<&ObjectId>;
    fn set_id(&mut self, id: ObjectId);

    async fn save(&mut self, db: &Database) -> Result<()> {
        let collection = db.collection::<Self>(Self::collection_name());

        if self.id().is_none() {
            // Insert - utiliser directement self
            let result = collection.insert_one(self.clone()).await?;
            if let Some(id) = result.inserted_id.as_object_id() {
                self.set_id(id);
            }
        } else {
            // Update - utiliser directement self
            let filter = doc! { "_id": self.id().unwrap() };
            collection.replace_one(filter, self).await?;
        }
        Ok(())
    }

    async fn delete(&self, db: &Database) -> Result<bool> {
        if let Some(id) = self.id() {
            let collection = db.collection::<Self>(Self::collection_name());
            let filter = doc! { "_id": id };
            let result = collection.delete_one(filter).await?;
            Ok(result.deleted_count > 0)
        } else {
            Err(OrmError::Validation("Cannot delete without ID".to_string()))
        }
    }

    // Méthode helper pour créer un nouvel enregistrement
    async fn create(mut self, db: &Database) -> Result<Self>
    where
        Self: Sized,
    {
        self.save(db).await?;
        Ok(self)
    }
}

#[async_trait]
pub trait Collection<T: Model>: Sized {
    async fn find_by_id(db: &Database, id: &ObjectId) -> Result<Option<T>> {
        let collection = db.collection::<T>(T::collection_name());
        let filter = doc! { "_id": id };
        let result = collection.find_one(filter).await?;
        Ok(result)
    }

    async fn find_all(db: &Database) -> Result<Vec<T>> {
        let collection = db.collection::<T>(T::collection_name());
        let mut cursor = collection.find(doc! {}).await?;
        let mut results = Vec::new();

        while let Some(result) = cursor.next().await {
            results.push(result?);
        }
        Ok(results)
    }

    async fn find_by_filter(db: &Database, filter: Document) -> Result<Vec<T>> {
        let collection = db.collection::<T>(T::collection_name());
        let mut cursor = collection.find(filter).await?;
        let mut results = Vec::new();

        while let Some(result) = cursor.next().await {
            results.push(result?);
        }
        Ok(results)
    }

    async fn find_one_by_filter(db: &Database, filter: Document) -> Result<Option<T>> {
        let collection = db.collection::<T>(T::collection_name());
        let result = collection.find_one(filter).await?;
        Ok(result)
    }

    async fn count(db: &Database) -> Result<u64> {
        let collection = db.collection::<T>(T::collection_name());
        let count = collection.count_documents(doc! {}).await?;
        Ok(count)
    }

    async fn count_by_filter(db: &Database, filter: Document) -> Result<u64> {
        let collection = db.collection::<T>(T::collection_name());
        let count = collection.count_documents(filter).await?;
        Ok(count)
    }

    async fn delete_many(db: &Database, filter: Document) -> Result<u64> {
        let collection = db.collection::<T>(T::collection_name());
        let result = collection.delete_many(filter).await?;
        Ok(result.deleted_count)
    }
}
