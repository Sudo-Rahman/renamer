pub fn create_main_window(app: tauri::AppHandle) {
    std::thread::spawn(move || {
        let mut builder = tauri::WebviewWindowBuilder::new
            (&app, "main", tauri::WebviewUrl::App("app".into()))
            .title("Renamer")
            .inner_size(1200.0, 600.0)
            .min_inner_size(1000.0, 600.0)
            .center();

        #[cfg(target_os = "macos")]
        {
            builder = builder
                .title_bar_style(tauri::TitleBarStyle::Overlay)
                .shadow(true);
        }

        #[cfg(any(target_os = "windows", target_os = "linux"))]
        {
            builder = builder
                .decorations(false)
                .transparent(true)
                .shadow(true);
        }

        builder.build().unwrap();
    });
}


pub fn create_update_window(app: tauri::AppHandle) {
    std::thread::spawn(move || {
        tauri::WebviewWindowBuilder::new(&app, "update", tauri::WebviewUrl::App("update".into()))
            .title("")
            .shadow(true)
            .decorations(false)
            .transparent(true)
            .resizable(false)
            .inner_size(400.0, 300.0)
            .center()
            .build()
            .unwrap();
    });
}