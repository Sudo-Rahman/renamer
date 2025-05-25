mod connection;
mod error;
mod traits;
mod model;
mod migrations; // Ajouter cette ligne

pub use connection::Database;
pub use traits::{Model, Collection, HasBaseModel};
pub use model::BaseModel;
pub use error::{OrmError, Result};
pub use migrations::{Migration, MigrationRunner}; // Ajouter cette ligne

// Re-export MongoDB types
pub use mongodb::{bson, Database as MongoDatabase, Collection as MongoCollection};
