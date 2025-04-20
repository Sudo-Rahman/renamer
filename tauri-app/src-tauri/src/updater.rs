use serde_json::json;
use tauri::{AppHandle, Emitter};
use tauri_plugin_dialog::{DialogExt, MessageDialogButtons};
use tauri_plugin_updater::UpdaterExt;
use crate::app::APPLICATION;
use crate::window::{create_update_window};

pub async fn check_update<F>(app: tauri::AppHandle, main_window: F) -> tauri_plugin_updater::Result<()>
where
    F: FnOnce(),
{
    if !APPLICATION.lock().await.check_update() {
        main_window();
        return Ok(());
    }
    if let Some(update) = app.updater()?.check().await? {
        APPLICATION.lock().await.set_new_version(update.version.clone());

        let answer = app.dialog()
            .message(t!("updater.message").to_string().replace("%s", &update.version))
            .title(t!("updater.title").to_string())
            .buttons(MessageDialogButtons::OkCancelCustom(t!("updater.yes_btn").to_string(), t!("updater.cancel_btn").to_string()))
            .blocking_show();

        if answer != true {
            main_window();
            return Ok(());
        }
        download_and_install_update(app).await?;
    }else { main_window(); }
    Ok(())
}

#[tauri::command]
pub async fn download_and_install_update(app: AppHandle) -> tauri_plugin_updater::Result<()> {
    #[cfg(any(target_os = "macos", target_os = "linux"))]
    { 
        create_update_window(app.clone());
        let mut downloaded = 0;
    }

    if let Some(update) = app.updater()?.check().await? {
        #[cfg(any(target_os = "macos", target_os = "linux"))]
        update
            .download_and_install(
                |chunk_length, content_length| {
                    downloaded += chunk_length;
                    app.emit(
                        "update_progress",
                        Some(json!({
                                "type": "download",
                                "downloaded": downloaded,
                                "total": content_length
                            })),
                    ).expect("failed to emit download progress");
                },
                || {
                    app.emit(
                        "update_progress",
                        Some(json!({
                                "type": "finish"
                            })),
                    ).expect("failed to emit install progress");
                },
            ).await?;
        #[cfg(any(target_os = "windows"))]
        update.download_and_install(|_,_|{},||{}).await?;

    }
    Ok(())
}
