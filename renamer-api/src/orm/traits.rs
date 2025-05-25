use std::collections::HashMap;
use async_trait::async_trait;
use bson::{Bson, DateTime};
use mongodb::bson::{doc, Document, oid::ObjectId};
use serde::{Deserialize, Serialize};
use crate::orm::{Database, Result, OrmError, BaseModel};
use futures::stream::StreamExt;

pub trait HasBaseModel {
        fn base(&self) -> &BaseModel;
        fn base_mut(&mut self) -> &mut BaseModel;

        // Méthodes helper pour accéder aux champs communs
        fn base_id(&self) -> Option<&ObjectId> {
            self.base().id.as_ref()
        }

        fn set_base_id(&mut self, id: ObjectId) {
            self.base_mut().id = Some(id);
        }

        fn base_created_at(&self) -> DateTime {
            self.base().created_at
        }

        fn base_updated_at(&self) -> DateTime {
            self.base().updated_at
        }

        fn base_touch(&mut self) {
            self.base_mut().touch();
        }
}

#[async_trait]
pub trait Model: Serialize + for<'de> Deserialize<'de> + Send + Sync + Unpin + Clone + HasBaseModel {
    fn collection_name() -> &'static str;

    // Méthodes abstraites que chaque modèle doit implémenter
    fn id(&self) -> Option<&ObjectId> {
        self.base_id()
    }

    fn set_id(&mut self, id: ObjectId) {
        self.set_base_id(id)
    }

    fn created_at(&self) -> DateTime {
        self.base_created_at()
    }

    fn updated_at(&self) -> DateTime {
        self.base_updated_at()
    }

    fn touch(&mut self) {
        self.base_touch()
    }

    // méthode pour obtenir les valeurs par défaut
    fn default_values() -> HashMap<String, mongodb::bson::Bson>;

    //  méthode pour les champs obligatoires
    fn required_fields() -> Vec<String>;

    //  méthode pour les champs imbriqués
    fn nested_field_defaults() -> HashMap<String, HashMap<String, Bson>> {
        HashMap::new()
    }

    // méthode pour les champs de tableaux imbriqués
    fn array_field_defaults() -> HashMap<String, HashMap<String, Bson>> {
        HashMap::new()
    }

    // Migration des champs de premier niveau (existant)
    async fn migrate_missing_fields(db: &Database) -> Result<usize> {
        let collection = db.collection::<Self>(Self::collection_name());
        let defaults = Self::default_values();

        if defaults.is_empty() {
            return Ok(0);
        }

        let mut total_updated = 0;

        for (field_name, default_value) in defaults {
            let filter = doc! { field_name.clone(): { "$exists": false } };
            let update = doc! { "$set": { field_name.clone(): default_value } };

            let result = collection.update_many(filter, update).await?;
            total_updated += result.modified_count;

            if result.modified_count > 0 {
                println!("✓ {} documents mis à jour pour le champ '{}'", result.modified_count, field_name);
            }
        }

        Ok(total_updated as usize)
    }

    // Nouvelle méthode pour migrer les champs imbriqués
    async fn migrate_nested_fields(db: &Database) -> Result<usize> {
        let collection = db.collection::<Self>(Self::collection_name());
        let nested_defaults = Self::nested_field_defaults();

        if nested_defaults.is_empty() {
            return Ok(0);
        }

        let mut total_updated = 0;

        for (parent_field, nested_fields) in nested_defaults {
            for (nested_field, default_value) in nested_fields {
                let nested_path = format!("{}.{}", parent_field, nested_field);

                // Filtrer les documents où le champ parent existe mais le champ imbriqué n'existe pas
                let filter = doc! {
                    parent_field.clone(): { "$exists": true },
                    nested_path.clone(): { "$exists": false }
                };

                let update = doc! {
                    "$set": { nested_path.clone(): default_value }
                };

                let result = collection.update_many(filter, update).await?;
                total_updated += result.modified_count;

                if result.modified_count > 0 {
                    println!("✓ {} documents mis à jour pour le champ imbriqué '{}'", result.modified_count, nested_path);
                }
            }
        }

        Ok(total_updated as usize)
    }

    // Nouvelle méthode pour migrer les champs dans les tableaux
    async fn migrate_array_fields(db: &Database) -> Result<usize> {
        let collection = db.collection::<Self>(Self::collection_name());
        let array_defaults = Self::array_field_defaults();

        if array_defaults.is_empty() {
            return Ok(0);
        }

        let mut total_updated = 0;

        for (array_field, field_defaults) in array_defaults {
            let mut set_operations = Document::new();

            for (field_name, default_value) in field_defaults {
                set_operations.insert(
                    format!("{}.{}", array_field, field_name),
                    doc! {
                        "$map": {
                            "input": format!("${}", array_field),
                            "as": "item",
                            "in": {
                                "$mergeObjects": [
                                    "$$item",
                                    {
                                        "$cond": {
                                            "if": { "$not": [format!("$$item.{}", field_name)] },
                                            "then": { field_name.clone(): default_value.clone() },
                                            "else": {}
                                        }
                                    }
                                ]
                            }
                        }
                    }
                );
            }

            if !set_operations.is_empty() {
                let pipeline = vec![
                    doc! { "$set": set_operations },
                    doc! { "$out": Self::collection_name() }
                ];

                // Compter les documents qui ont le tableau
                let count_filter = doc! { 
                    array_field.clone(): { "$exists": true, "$type": "array", "$not": { "$size": 0 } }
                };
                let count = collection.count_documents(count_filter).await?;

                if count > 0 {
                    collection.aggregate(pipeline).await?;
                    total_updated += count;
                    println!("✓ {} documents mis à jour pour les champs du tableau '{}'", count, array_field);
                }
            }
        }

        Ok(total_updated as usize)
    }

    // Méthode combinée pour toutes les migrations
    async fn migrate_all_fields(db: &Database) -> Result<usize> {
        let mut total = 0;

        // Migration des champs de premier niveau
        total += Self::migrate_missing_fields(db).await?;

        // Migration des champs imbriqués
        total += Self::migrate_nested_fields(db).await?;

        // Migration des champs dans les tableaux
        total += Self::migrate_array_fields(db).await?;

        Ok(total)
    }

    // Vérification des champs manquants
    async fn check_missing_fields(db: &Database) -> Result<HashMap<String, u64>> {
        let collection = db.collection::<Document>(Self::collection_name());
        let defaults = Self::default_values();
        let required = Self::required_fields();
        let mut missing_counts = HashMap::new();

        // Vérifier chaque champ individuellement
        for field_name in defaults.keys().chain(required.iter()) {
            let filter = doc! { field_name: { "$exists": false } };
            let count = collection.count_documents(filter).await?;
            if count > 0 {
                missing_counts.insert(field_name.clone(), count);
            }
        }

        Ok(missing_counts)
    }

    // Nouvelle méthode pour vérifier les champs imbriqués manquants
    async fn check_missing_nested_fields(db: &Database) -> Result<HashMap<String, u64>> {
        let collection = db.collection::<Self>(Self::collection_name());
        let nested_defaults = Self::nested_field_defaults();
        let mut missing_counts = HashMap::new();

        for (parent_field, nested_fields) in nested_defaults {
            for (nested_field, _) in nested_fields {
                let nested_path = format!("{}.{}", parent_field, nested_field);

                // Compter les documents où le champ parent existe mais le champ imbriqué n'existe pas
                let filter = doc! {
                    parent_field.clone(): { "$exists": true },
                    nested_path.clone(): { "$exists": false }
                };

                let count = collection.count_documents(filter).await?;
                if count > 0 {
                    missing_counts.insert(nested_path, count);
                }
            }
        }

        Ok(missing_counts)
    }

    // Nouvelle méthode pour vérifier les champs manquants dans les tableaux
    async fn check_missing_array_fields(db: &Database) -> Result<HashMap<String, u64>> {
        let collection = db.collection::<Self>(Self::collection_name());
        let array_defaults = Self::array_field_defaults();
        let mut missing_counts = HashMap::new();

        for (array_field, field_defaults) in array_defaults {
            for (field_name, _) in field_defaults {
                // Pipeline d'agrégation pour compter les documents avec des éléments de tableau manquants
                let pipeline = vec![
                    doc! {
                        "$match": {
                            array_field.clone(): { 
                                "$exists": true, 
                                "$type": "array", 
                                "$not": { "$size": 0 } 
                            }
                        }
                    },
                    doc! {
                        "$project": {
                            "missing_field_count": {
                                "$size": {
                                    "$filter": {
                                        "input": format!("${}", array_field),
                                        "as": "item",
                                        "cond": {
                                            "$not": [format!("$$item.{}", field_name)]
                                        }
                                    }
                                }
                            }
                        }
                    },
                    doc! {
                        "$match": {
                            "missing_field_count": { "$gt": 0 }
                        }
                    },
                    doc! {
                        "$count": "total"
                    }
                ];

                let mut cursor = collection.aggregate(pipeline).await?;
                if let Some(result) = cursor.next().await {
                    let doc = result?;
                    if let Ok(count) = doc.get_i32("total") {
                        let field_path = format!("{}.{}", array_field, field_name);
                        missing_counts.insert(field_path, count as u64);
                    }
                }
            }
        }

        Ok(missing_counts)
    }

    // Méthode combinée pour vérifier tous les types de champs manquants
    async fn check_missing_all_fields(db: &Database) -> Result<HashMap<String, HashMap<String, u64>>> {
        let mut all_missing = HashMap::new();

        // Vérifier les champs de premier niveau
        let first_level = Self::check_missing_fields(db).await?;
        if !first_level.is_empty() {
            all_missing.insert("first_level".to_string(), first_level);
        }

        // Vérifier les champs imbriqués
        let nested = Self::check_missing_nested_fields(db).await?;
        if !nested.is_empty() {
            all_missing.insert("nested_fields".to_string(), nested);
        }

        // Vérifier les champs dans les tableaux
        let arrays = Self::check_missing_array_fields(db).await?;
        if !arrays.is_empty() {
            all_missing.insert("array_fields".to_string(), arrays);
        }

        Ok(all_missing)
    }

    // Méthode helper pour un affichage formaté des champs manquants
    async fn display_missing_fields(db: &Database) -> Result<()> {
        let all_missing = Self::check_missing_all_fields(db).await?;
        let collection_name = Self::collection_name().to_uppercase();

        println!("\n=== {} ===", collection_name);

        if all_missing.is_empty() {
            println!("✅ Tous les champs sont présents");
            return Ok(());
        }

        // Afficher les champs de premier niveau
        if let Some(first_level) = all_missing.get("first_level") {
            println!("📋 Champs de premier niveau:");
            for (field, count) in first_level {
                println!("  ❌ {}: {} documents manquants", field, count);
            }
        }

        // Afficher les champs imbriqués
        if let Some(nested) = all_missing.get("nested_fields") {
            println!("🔗 Champs imbriqués:");
            for (field_path, count) in nested {
                println!("  ❌ {}: {} documents manquants", field_path, count);
            }
        }

        // Afficher les champs dans les tableaux
        if let Some(arrays) = all_missing.get("array_fields") {
            println!("📋 Champs dans les tableaux:");
            for (field_path, count) in arrays {
                println!("  ❌ {}: {} documents avec éléments manquants", field_path, count);
            }
        }

        Ok(())
    }


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
