use reqwest::{Client, Response};
use std::collections::HashMap;
use std::sync::OnceLock;
use std::env::var;
use axum::http::StatusCode;
use chrono::Utc;
use mongodb::bson::{bson, Bson};
use reqwest::multipart;
use tokio::fs::OpenOptions;
use mongodb::bson;
use tokio::io::AsyncWriteExt;
use crate::models::Log;

pub struct MailgunEmail {
    pub from: String,
    pub to: String,
}

pub struct OrderConfirmationData {
    pub payment_intent: String,
    pub invoice_url: String,
    pub license_key: String,
}

pub struct RemoveMachineData {
    pub machine_name: String,
    pub license_key: String,
}

struct SendEmailData {
    pub from: String,
    pub to: String,
    pub subject: String,
    pub html: String,
}

static API_KEY: OnceLock<String> = OnceLock::new();


impl MailgunEmail {
    
    pub async fn send_order_confirmation(&self, data: OrderConfirmationData) -> Result<(), Log> {
        let html = include_str!("templates/order_confirmation.html")
            .replace("{{payment_intent}}", &data.payment_intent)
            .replace("{{invoice_url}}", &data.invoice_url)
            .replace("{{license_key}}", &data.license_key);

        self.send(SendEmailData {
            from: self.from.clone(),
            to: self.to.clone(),
            subject: "Your purchase is confirmed".to_string(),
            html,
        }).await
    }

    pub async fn send_remove_machine(&self, data: RemoveMachineData) -> Result<(), Log> {
        let html = include_str!("templates/remove_machine.html")
            .replace("{{machine_name}}", &data.machine_name)
            .replace("{{license_key}}", &data.license_key)
            .replace("{{removal_date}}", &Utc::now().to_string());

        self.send(SendEmailData {
            from: self.from.clone(),
            to: self.to.clone(),
            subject: "Machine removed".to_string(),
            html,
        }).await
    }

    async fn send(&self, data: SendEmailData) -> Result<(), Log> {
        let client = Client::builder()
            .redirect(reqwest::redirect::Policy::none())
            .build()
            .unwrap();
        let url = format!("https://api.eu.mailgun.net/{}/messages", MailgunEmail::get_domain());

        let api_key = API_KEY.get().unwrap().clone();

        let form = multipart::Form::new()
            .text("from", data.from)
            .text("to", data.to)
            .text("subject", data.subject)
            .text("html", data.html);

        let response = client.post(format!("https://api.eu.mailgun.net/v3/{}/messages", MailgunEmail::get_domain()))
            .basic_auth("api", Some(api_key))
            .multipart(form)
            .send().await;

        let mut error = response.is_err();
        let mut text = "".to_string();
        if error {
            text = response.as_ref().err().unwrap().to_string();
        }

        if !error && response.as_ref().unwrap().status() != StatusCode::OK {
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
    pub fn init() {
        let api_key = var("MAILGUN_API_KEY_DEV").expect("MAILGUN_API_KEY environment variable not found");
        API_KEY.set(api_key.to_string()).expect("Failed to set API key");
    }

    #[cfg(not(debug_assertions))]
    pub fn init() {
        let api_key = var("MAILGUN_API_KEY").expect("MAILGUN_API_KEY environment variable not found");
        API_KEY.set(api_key.to_string()).expect("Failed to set API key");
    }
    

    pub(crate) const fn get_domain() -> &'static str {
        "renamer.pro"
    }
}
