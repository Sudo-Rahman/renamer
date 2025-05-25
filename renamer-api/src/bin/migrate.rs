use std::env;
use dotenv::dotenv;
use std::process::exit;
use async_trait::async_trait;

use renamer_api::{Mongo, Database, Model};
use renamer_api::models::{User, Log};
use renamer_api::orm::Migration;


// Migration automatique basée sur les modèles
struct AutoMigration;

#[async_trait]
impl Migration for AutoMigration {
    fn name(&self) -> &'static str {
        "auto_migrate_missing_fields"
    }

    fn version(&self) -> u32 {
        1
    }

    async fn up(&self, db: &Database) -> renamer_api::orm::Result<()> {
        println!("🔍 Analyse des modèles pour migration automatique...");

        // Vérifier les champs manquants
        println!("\n📊 Vérification des champs manquants:");

        let user_missing = User::check_missing_fields(db).await?;
        if !user_missing.is_empty() {
            println!("Users - Champs manquants:");
            for (field, count) in &user_missing {
                println!("  - {}: {} documents", field, count);
            }
        } else {
            println!("Users - Aucun champ manquant ✓");
        }

        let log_missing = Log::check_missing_fields(db).await?;
        if !log_missing.is_empty() {
            println!("Logs - Champs manquants:");
            for (field, count) in &log_missing {
                println!("  - {}: {} documents", field, count);
            }
        } else {
            println!("Logs - Aucun champ manquant ✓");
        }

        // Effectuer les migrations
        println!("\n🔧 Migration automatique des champs manquants:");

        let user_migrated = User::migrate_all_fields(db).await?;
        let log_migrated = Log::migrate_all_fields(db).await?;

        println!("\n✅ Migration automatique terminée:");
        println!("  - Users: {} documents migrés", user_migrated);
        println!("  - Logs: {} documents migrés", log_migrated);

        Ok(())
    }

    async fn down(&self, _db: &Database) -> renamer_api::orm::Result<()> {
        println!("⚠️  La migration automatique ne peut pas être rollback automatiquement");
        println!("   Les champs ajoutés sont conservés pour la sécurité");
        Ok(())
    }
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    dotenv().ok();

    let args: Vec<String> = env::args().collect();
    let command = args.get(1).map(|s| s.as_str()).unwrap_or("auto");

    let mongo = Mongo::new().await.unwrap_or_else(|e| {
        eprintln!("Failed to connect to the database: {}", e);
        exit(1);
    });

    let db = mongo.get_orm_db().clone();

    match command {
        "auto" => {
            println!("🚀 Migration automatique des modèles...");
            let migration = AutoMigration;
            migration.up(&db).await?;
        },
        "check" => {
            println!("🔍 Vérification des champs manquants...");

            println!("\n=== USERS ===");
            let user_missing = User::check_missing_fields(&db).await?;
            if user_missing.is_empty() {
                println!("✅ Tous les champs sont présents");
            } else {
                for (field, count) in user_missing {
                    println!("❌ {}: {} documents manquants", field, count);
                }
            }

            println!("\n=== LOGS ===");
            let log_missing = Log::check_missing_fields(&db).await?;
            if log_missing.is_empty() {
                println!("✅ Tous les champs sont présents");
            } else {
                for (field, count) in log_missing {
                    println!("❌ {}: {} documents manquants", field, count);
                }
            }
        },
        "users" => {
            println!("🔧 Migration des champs manquants pour Users...");
            let migrated = User::migrate_missing_fields(&db).await?;
            println!("✅ {} documents Users migrés", migrated);
        },
        "logs" => {
            println!("🔧 Migration des champs manquants pour Logs...");
            let migrated = Log::migrate_missing_fields(&db).await?;
            println!("✅ {} documents Logs migrés", migrated);
        },
        _ => {
            println!("Usage: cargo run --bin migrate [auto|check|users|logs]");
            println!("  auto  - Migration automatique de tous les modèles");
            println!("  check - Vérifier les champs manquants");
            println!("  users - Migrer seulement les Users");
            println!("  logs  - Migrer seulement les Logs");
        }
    }

    Ok(())
}
