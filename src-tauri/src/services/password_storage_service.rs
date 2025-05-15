use log::{debug, error, info, warn};
use rusqlite::{params, Connection, Error as RusqliteError, OpenFlags};
use std::path::PathBuf;
use tauri_plugin_store::StoreExt; // Импортируем макросы логирования

use crate::models::password_storage_model::PasswordStorageModel;

#[derive(Debug, thiserror::Error)]
pub enum DBManagerError {
    #[error("Ошибка базы данных: {0}")]
    Database(#[from] RusqliteError),
    #[error("Неверный ключ шифрования")]
    InvalidKey,
    #[error("Нет соединения с базой данных")]
    NoConnection,
}

#[derive(Debug)]
pub struct PasswordStorageService {
    pub connection: Option<Connection>,
    pub path: Option<PathBuf>,
}

impl PasswordStorageService {
    pub fn create(
        &mut self,
        model: PasswordStorageModel,
        path: PathBuf,
    ) -> Result<String, DBManagerError> {
        info!("Создание базы данных по пути: {:?}", path);
        let flags = OpenFlags::SQLITE_OPEN_READ_WRITE | OpenFlags::SQLITE_OPEN_CREATE;
        let conn = Connection::open_with_flags(&path, flags)?;
        debug!("Соединение с базой данных установлено.");

        conn.pragma_update(None, "key", &model.master_password)?;
        debug!("Ключ шифрования установлен.");

        conn.pragma_update(None, "foreign_keys", "ON")?;
        debug!("Включены внешние ключи.");

        Self::create_main_table(&conn, &model)?;
        info!("Основная таблица создана успешно.");

        self.connection = Some(conn);
        self.path = Some(path);
        debug!("Соединение сохранено в состоянии менеджера.");

        Ok("Соединение с базой данных успешно установлено.".to_string())
    }

    pub fn open(
        &mut self,
        path: PathBuf,
        master_password: String,
    ) -> Result<String, DBManagerError> {
        info!("Открытие базы данных по пути: {:?}", path);
        let flags = OpenFlags::SQLITE_OPEN_READ_WRITE | OpenFlags::SQLITE_OPEN_CREATE;
        let conn = Connection::open_with_flags(&path, flags)?;
        debug!("Соединение с базой данных установлено.");

        conn.pragma_update(None, "key", &master_password)?;
        debug!("Ключ шифрования применен.");

        // Проверка валидности ключа
        conn.query_row("SELECT id FROM password_storage LIMIT 1", [], |row| {
            row.get::<_, String>(0)
        })
        .map_err(|err| {
            error!("Ошибка проверки ключа: {:?}", err);
            match err {
                RusqliteError::QueryReturnedNoRows | RusqliteError::SqliteFailure(_, _) => {
                    DBManagerError::InvalidKey
                }
                other => DBManagerError::Database(other),
            }
        })?;
        debug!("Ключ шифрования проверен успешно.");

        self.connection = Some(conn);
        self.path = Some(path);
        debug!("Соединение сохранено в состоянии менеджера.");

        Ok("Соединение с базой данных успешно установлено.".to_string())
    }

    pub fn close(&mut self, app_handle: &tauri::AppHandle) -> Result<String, DBManagerError> {
        info!("Закрытие соединения с базой данных.");

        if let Some(conn) = self.connection.take() {
            let result = conn.close();

            match result {
                Ok(_) => {
                    if let Ok(settings) = app_handle.store("settings.json") {
                        if let Some(path) = self.path.clone() {
                            settings.set(
                                crate::constants::settings_consts::LAST_PATH_DB,
                                path.to_str().unwrap(),
                            );
                            // settings.save(); // если нужно
                            debug!("Путь к базе данных сохранен в настройках: {:?}", path);
                        }
                    }

                    info!("Соединение с базой данных успешно закрыто.");
                    Ok("Соединение с базой данных успешно закрыто.".to_string())
                }
                Err((conn, err)) => {
                    error!("Ошибка при закрытии соединения: {}", err);
                    self.connection = Some(conn);
                    Err(DBManagerError::Database(err))
                }
            }
        } else {
            warn!("Соединение уже закрыто.");
            Ok("Соединение уже закрыто.".to_string())
        }
    }

    fn create_main_table(
        conn: &Connection,
        model: &PasswordStorageModel,
    ) -> Result<(), RusqliteError> {
        debug!("Создание таблицы password_storage.");
        conn.execute_batch(
            "CREATE TABLE IF NOT EXISTS password_storage (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                description TEXT DEFAULT NULL,
                created_at TEXT NOT NULL,
                updated_at TEXT DEFAULT NULL
            )",
        )?;
        debug!("Таблица password_storage создана или уже существует.");

        conn.execute(
            "INSERT INTO password_storage (
                id, 
                name, 
                description, 
                created_at, 
                updated_at 
            ) VALUES (?, ?, ?, ?, ?)",
            params![
                model.id.to_string(),
                model.name,
                model.description,
                model.created_at,
                model.updated_at
            ],
        )?;
        debug!("Данные успешно вставлены в таблицу password_storage.");

        Ok(())
    }
}
