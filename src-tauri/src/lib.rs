pub mod commands;
pub mod constants;
pub mod dto;
pub mod models;
pub mod services;
pub mod states;
pub mod utils;
use crate::commands::password_storage_cmd::{
    close_password_storage_cmd, create_password_storage_cmd, open_password_storage_cmd,
};
use crate::states::db_manager::DBManager;
use log::{error, info};

use services::password_storage_service::DBManagerError;
use tauri::{Manager, Window, WindowEvent};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
#[tokio::main]
pub async fn run() {
    tauri::Builder::default()
        .manage(DBManager::default())
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(
            tauri_plugin_log::Builder::new()
                .target(tauri_plugin_log::Target::new(
                    tauri_plugin_log::TargetKind::Stdout,
                ))
                .target(tauri_plugin_log::Target::new(
                    tauri_plugin_log::TargetKind::LogDir {
                        file_name: Some("logs".to_string()),
                    },
                ))
                .format(|out, message, record| {
                    out.finish(format_args!(
                        "[{} {}] {}",
                        record.level(),
                        record.target(),
                        message
                    ))
                })
                .timezone_strategy(tauri_plugin_log::TimezoneStrategy::UseLocal)
                .build(),
        )
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_clipboard_manager::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            create_password_storage_cmd,
            open_password_storage_cmd,
            close_password_storage_cmd
        ])
        .on_window_event(|event, window_event| match window_event {
            WindowEvent::CloseRequested { api, .. } => {
                let window_label = event.label();
                info!("Окно {} запрошено на закрытие", window_label);

                if window_label != "main" {
                    return;
                }

                let db_manager_state = event.state::<DBManager>();

                let result = db_manager_state
                    .with_service_ref_mut(|service| service.close(event.app_handle()));

                match result {
                    Ok(s) => info!("Соединение с базой данных закрыто: {}", s),
                    Err(e) => match e {
                        DBManagerError::NoConnection => {
                            info!("Соединение с базой данных уже закрыто.")
                        }
                        _ => {
                            api.prevent_close();
                            error!("Ошибка закрытия соединения с базой данных: {}", e)
                        }
                    },
                }
            }
            WindowEvent::Destroyed => {
                let window_label = event.label();
                info!("Окно {} уничтожено", window_label);
            }
            WindowEvent::Focused { 0: state } => {
                let window_label = event.label();
                if *state {
                    info!("Окно {} получило фокус", window_label);
                } else {
                    info!("Окно {} потеряло фокус", window_label);
                }
            }
            _ => {} // Игнорируем остальные события
        })
        .setup(|app| {
            let app_handle = app.handle();
            #[cfg(debug_assertions)]
            {
                app_handle
                    .webview_windows()
                    .get("main")
                    .unwrap()
                    .open_devtools();

                let app_path = app_handle.path();

                let app_config_dir = app_path.app_config_dir().unwrap();
                let app_data_dir = app_path.app_data_dir().unwrap();
                let app_logs_dir = app_path.app_log_dir().unwrap();

                info!(
                    "Путь к конфигурационному каталогу: {}",
                    app_config_dir.display()
                );
                info!("Путь к каталогу данных: {}", app_data_dir.display());
                info!("Путь к каталогу логов: {}", app_logs_dir.display());
            }

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
