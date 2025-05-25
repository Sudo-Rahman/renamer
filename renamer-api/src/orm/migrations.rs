use async_trait::async_trait;
use mongodb::bson::{doc, Document};
use crate::orm::{Database, Result};
use std::collections::HashMap;
use futures::stream::StreamExt;

#[async_trait]
pub trait Migration: Send + Sync {
    fn name(&self) -> &'static str;
    fn version(&self) -> u32;
    async fn up(&self, db: &Database) -> Result<()>;
    async fn down(&self, db: &Database) -> Result<()>;
}

pub struct MigrationRunner {
    db: Database,
    migrations: Vec<Box<dyn Migration>>,
}

impl MigrationRunner {
    pub fn new(db: Database) -> Self {
        Self {
            db,
            migrations: Vec::new(),
        }
    }

    pub fn add_migration(mut self, migration: Box<dyn Migration>) -> Self {
        self.migrations.push(migration);
        self
    }

    pub async fn migrate_up(&self) -> Result<()> {
        self.ensure_migration_collection().await?;

        let mut sorted_migrations = self.migrations.iter().collect::<Vec<_>>();
        sorted_migrations.sort_by_key(|m| m.version());

        let applied_migrations = self.get_applied_migrations().await?;

        for migration in sorted_migrations {
            if !applied_migrations.contains_key(&migration.version()) {
                println!("Applying migration: {} (v{})", migration.name(), migration.version());

                migration.up(&self.db).await?;
                self.record_migration(migration.as_ref()).await?;

                println!("✓ Migration {} applied successfully", migration.name());
            }
        }

        println!("All migrations completed successfully!");
        Ok(())
    }

    pub async fn migrate_down(&self, target_version: Option<u32>) -> Result<()> {
        let applied_migrations = self.get_applied_migrations().await?;
        let mut migrations_to_rollback = Vec::new();

        for migration in &self.migrations {
            let version = migration.version();
            if applied_migrations.contains_key(&version) {
                if let Some(target) = target_version {
                    if version > target {
                        migrations_to_rollback.push(migration.as_ref());
                    }
                } else {
                    if migrations_to_rollback.is_empty() || version > migrations_to_rollback[0].version() {
                        migrations_to_rollback = vec![migration.as_ref()];
                    }
                }
            }
        }

        migrations_to_rollback.sort_by_key(|m| std::cmp::Reverse(m.version()));

        for migration in migrations_to_rollback {
            println!("Rolling back migration: {} (v{})", migration.name(), migration.version());

            migration.down(&self.db).await?;
            self.remove_migration_record(migration.version()).await?;

            println!("✓ Migration {} rolled back successfully", migration.name());
        }

        Ok(())
    }

    async fn ensure_migration_collection(&self) -> Result<()> {
        let collection = self.db.collection::<Document>("_migrations");

        use mongodb::options::IndexOptions;
        use mongodb::IndexModel;

        let index = IndexModel::builder()
            .keys(doc! { "version": 1 })
            .options(IndexOptions::builder().unique(true).build())
            .build();

        collection.create_index(index).await?;
        Ok(())
    }

    async fn get_applied_migrations(&self) -> Result<HashMap<u32, String>> {
        let collection = self.db.collection::<Document>("_migrations");
        let mut cursor = collection.find(doc! {}).await?;

        let mut applied = HashMap::new();

        while let Some(result) = cursor.next().await {
            let doc = result?;
            if let (Some(version), Some(name)) = (doc.get_i32("version").ok(), doc.get_str("name").ok()) {
                applied.insert(version as u32, name.to_string());
            }
        }

        Ok(applied)
    }

    async fn record_migration(&self, migration: &dyn Migration) -> Result<()> {
        let collection = self.db.collection::<Document>("_migrations");
        let doc = doc! {
            "version": migration.version() as i32,
            "name": migration.name(),
            "applied_at": mongodb::bson::DateTime::now()
        };

        collection.insert_one(doc).await?;
        Ok(())
    }

    async fn remove_migration_record(&self, version: u32) -> Result<()> {
        let collection = self.db.collection::<Document>("_migrations");
        collection.delete_one(doc! { "version": version as i32 }).await?;
        Ok(())
    }

    pub async fn migration_status(&self) -> Result<()> {
        let applied_migrations = self.get_applied_migrations().await?;

        println!("Migration Status:");
        println!("=================");

        let mut sorted_migrations = self.migrations.iter().collect::<Vec<_>>();
        sorted_migrations.sort_by_key(|m| m.version());

        for migration in sorted_migrations {
            let status = if applied_migrations.contains_key(&migration.version()) {
                "✓ Applied"
            } else {
                "✗ Pending"
            };

            println!("v{:03} - {} - {}", migration.version(), migration.name(), status);
        }

        Ok(())
    }
}
