mod connection;
mod error;
mod traits;
mod model;

pub use connection::Database;
pub use traits::{Model, Collection};
pub use model::BaseModel;
pub use error::{OrmError, Result};

// Re-export MongoDB types
pub use mongodb::{bson, Database as MongoDatabase, Collection as MongoCollection};
