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
                println!("Окно запрошено на закрытие");
                let db_manager_state = event.state::<DBManager>();

                let result = db_manager_state.with_service_ref_mut(|service| {
                    service.close(event.app_handle()).unwrap();
                });

                match result {
                    Ok(_) => info!("Соединение с базой данных успешно закрыто."),
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
                println!("Окно уничтожено");
            }
            _ => {} // Игнорируем остальные события
        })
        .setup(|app| Ok(()))
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
