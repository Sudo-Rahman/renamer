use tokio::fs::OpenOptions;
use tokio::io::AsyncWriteExt;
use crate::models::Log;
use crate::orm::Model;

pub async fn insert_log(log: Log) {
    //     write in the log file
    let mut file = OpenOptions::new()
        .create(true)
        .write(true)
        .append(true)
        .open("log.txt").await.unwrap();
    let log = format!("{}: {}", log.created_at(), log.message);
    file.write_all(log.as_bytes()).await.unwrap();
}