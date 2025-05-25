use std::fmt;

#[derive(Debug)]
pub enum OrmError {
    Connection(String),
    Serialization(String),
    Database(mongodb::error::Error),
    NotFound,
    Validation(String),
}

impl fmt::Display for OrmError {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        match self {
            OrmError::Connection(msg) => write!(f, "Erreur de connexion: {}", msg),
            OrmError::Serialization(msg) => write!(f, "Erreur de sérialisation: {}", msg),
            OrmError::Database(err) => write!(f, "Erreur de base de données: {}", err),
            OrmError::NotFound => write!(f, "Enregistrement non trouvé"),
            OrmError::Validation(msg) => write!(f, "Erreur de validation: {}", msg),
        }
    }
}

impl From<mongodb::error::Error> for OrmError {
    fn from(error: mongodb::error::Error) -> Self {
        OrmError::Database(error)
    }
}

impl From<mongodb::bson::ser::Error> for OrmError {
    fn from(error: mongodb::bson::ser::Error) -> Self {
        OrmError::Serialization(error.to_string())
    }
}

impl From<mongodb::bson::de::Error> for OrmError {
    fn from(error: mongodb::bson::de::Error) -> Self {
        OrmError::Serialization(error.to_string())
    }
}

impl std::error::Error for OrmError {
    fn source(&self) -> Option<&(dyn std::error::Error + 'static)> {
        match self {
            OrmError::Database(err) => Some(err),
            _ => None,
        }
    }
}


pub type Result<T> = std::result::Result<T, OrmError>;

