use reqwest::{Client, Response};
use std::collections::HashMap;
use axum::http::StatusCode;
use mongodb::bson::{bson, Bson};
use reqwest::multipart;
use tokio::fs::OpenOptions;
use mongodb::bson;
use tokio::io::AsyncWriteExt;
use crate::models::Log;

pub struct MailgunEmail {
    pub from: String,
    pub to: String,
    pub subject: String,
    pub text: String,
}

impl MailgunEmail {
    pub async fn send(&self) -> Result<(), Log> {
        let client = Client::builder()
            .redirect(reqwest::redirect::Policy::none())
            .build()
            .unwrap();
        let url = format!("https://api.eu.mailgun.net/{}/messages", MailgunEmail::get_domain());

        let api_key = self.get_api_key().expect("Failed to get API key");

        // Créer un formulaire multipart
        let form = multipart::Form::new()
            .text("from", self.from.clone())
            .text("to", self.to.clone())
            .text("subject", self.subject.clone())
            .text("text", self.text.clone());

        let response = client.post(format!("https://api.eu.mailgun.net/v3/{}/messages", MailgunEmail::get_domain()))
            .basic_auth("api", Some(api_key))
            .multipart(form)
            .send().await;

        let mut  error = response.is_err();
        let mut text = "".to_string();
        if error {
            text = response.as_ref().err().unwrap().to_string();
        }

        if !error  && response.as_ref().unwrap().status() != StatusCode::OK {
            error = true;
            text = response.unwrap().text().await.unwrap();
        }

        if error {
            return Err(Log {
                _id: bson::oid::ObjectId::new(),
                date_time: bson::DateTime::now(),
                message: format!("Failed to send email to {}: {}", self.to, text),
            });
        }

        Ok(())
    }

    #[cfg(debug_assertions)]
    fn get_api_key(&self) -> Result<String, String> {
        std::env::var("MAILGUN_API_KEY_DEV").map_err(|_| "MAILGUN_API_KEY environment variable not found".to_string())
    }

    #[cfg(not(debug_assertions))]
    fn get_api_key(&self) -> Result<String, String> {
        std::env::var("MAILGUN_API_KEY").or_else(|_| {
            Err("MAILGUN_API_KEY environment variable not found".to_string())
        })
    }

    pub(crate) const fn get_domain() -> &'static str {
        "renamer.pro"
    }
}
