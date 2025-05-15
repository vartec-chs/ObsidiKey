// use log::{debug, error, info, warn};
// use rusqlite::{params, Connection, Error as RusqliteError, OpenFlags};
// use std::{
//     path::PathBuf,
//     sync::{Arc, Mutex},
// };
// use tauri_plugin_store::StoreExt; // Импортируем макросы логирования

// use crate::models::password_storage_model::PasswordStorageModel;

// #[derive(Debug, thiserror::Error)]
// pub enum DBManagerError {
//     #[error("Ошибка базы данных: {0}")]
//     Database(#[from] RusqliteError),
//     #[error("Неверный ключ шифрования")]
//     InvalidKey,
//     #[error("Нет соединения с базой данных")]
//     NoConnection,
// }

// #[derive(Debug)]
// pub struct DBManager {
//     connection: Arc<Mutex<Option<Connection>>>,
//     path: Option<PathBuf>,
// }
// impl Default for DBManager {
//     fn default() -> Self {
//         Self {
//             connection: Arc::new(Mutex::new(None)),
//             path: None,
//         }
//     }
// }

// impl DBManager {
//     pub fn create(
//         &mut self,
//         model: PasswordStorageModel,
//         path: PathBuf,
//     ) -> Result<(), DBManagerError> {
//         info!("Создание базы данных по пути: {:?}", path);
//         let flags = OpenFlags::SQLITE_OPEN_READ_WRITE | OpenFlags::SQLITE_OPEN_CREATE;
//         let conn = Connection::open_with_flags(&path, flags)?;
//         debug!("Соединение с базой данных установлено.");

//         conn.pragma_update(None, "key", &model.master_password)?;
//         debug!("Ключ шифрования установлен.");

//         conn.pragma_update(None, "foreign_keys", "ON")?;
//         debug!("Включены внешние ключи.");

//         Self::create_main_table(&conn, &model)?;
//         info!("Основная таблица создана успешно.");

//         let mut lock = self.connection.lock().unwrap();
//         *lock = Some(conn);
//         self.path = Some(path);
//         debug!("Соединение сохранено в состоянии менеджера.");

//         Ok(())
//     }

//     pub fn open(&mut self, path: PathBuf, master_password: String) -> Result<(), DBManagerError> {
//         info!("Открытие базы данных по пути: {:?}", path);
//         let flags = OpenFlags::SQLITE_OPEN_READ_WRITE | OpenFlags::SQLITE_OPEN_CREATE;
//         let conn = Connection::open_with_flags(&path, flags)?;
//         debug!("Соединение с базой данных установлено.");

//         conn.pragma_update(None, "key", &master_password)?;
//         debug!("Ключ шифрования применен.");

//         // Проверка валидности ключа
//         conn.query_row("SELECT id FROM password_storage LIMIT 1", [], |row| {
//             row.get::<_, String>(0)
//         })
//         .map_err(|err| {
//             error!("Ошибка проверки ключа: {:?}", err);
//             match err {
//                 RusqliteError::QueryReturnedNoRows | RusqliteError::SqliteFailure(_, _) => {
//                     DBManagerError::InvalidKey
//                 }
//                 other => DBManagerError::Database(other),
//             }
//         })?;
//         debug!("Ключ шифрования проверен успешно.");

//         let mut lock = self.connection.lock().unwrap();
//         *lock = Some(conn);
//         self.path = Some(path);
//         debug!("Соединение сохранено в состоянии менеджера.");

//         Ok(())
//     }

//     pub fn close(&mut self, app_handle: &tauri::AppHandle) -> Result<String, DBManagerError> {
//         info!("Закрытие соединения с базой данных.");
//         let mut lock = self.connection.lock().unwrap();
//         if let Some(conn) = lock.take() {
//             let result = conn.close();

//             match result {
//                 Ok(_) => {
//                     if let Ok(settings) = app_handle.store("settings.json") {
//                         if let Some(path) = self.path.clone() {
//                             settings.set(
//                                 crate::constants::settings_consts::LAST_PATH_DB,
//                                 path.to_str().unwrap(),
//                             );
//                             // settings.save(); // если нужно
//                             debug!("Путь к базе данных сохранен в настройках: {:?}", path);
//                         }
//                     }

//                     info!("Соединение с базой данных успешно закрыто.");
//                     Ok("Соединение с базой данных успешно закрыто.".to_string())
//                 }
//                 Err((conn, err)) => {
//                     error!("Ошибка при закрытии соединения: {}", err);
//                     *lock = Some(conn);
//                     Err(DBManagerError::Database(err))
//                 }
//             }
//         } else {
//             warn!("Соединение уже закрыто.");
//             Ok("Соединение уже закрыто.".to_string())
//         }
//     }

//     fn create_main_table(
//         conn: &Connection,
//         model: &PasswordStorageModel,
//     ) -> Result<(), RusqliteError> {
//         debug!("Создание таблицы password_storage.");
//         conn.execute_batch(
//             "CREATE TABLE IF NOT EXISTS password_storage (
//                 id TEXT PRIMARY KEY,
//                 name TEXT NOT NULL,
//                 description TEXT DEFAULT NULL,
//                 created_at TEXT NOT NULL,
//                 updated_at TEXT DEFAULT NULL
//             )",
//         )?;
//         debug!("Таблица password_storage создана или уже существует.");

//         conn.execute(
//             "INSERT INTO password_storage (
//                 id,
//                 name,
//                 description,
//                 created_at,
//                 updated_at
//             ) VALUES (?, ?, ?, ?, ?)",
//             params![
//                 model.id.to_string(),
//                 model.name,
//                 model.description,
//                 model.created_at,
//                 model.updated_at
//             ],
//         )?;
//         debug!("Данные успешно вставлены в таблицу password_storage.");

//         Ok(())
//     }
// }

// impl DBManager {
//     pub fn with_connection<F, R>(&self, f: F) -> Result<R, DBManagerError>
//     where
//         F: FnOnce(&Connection) -> R,
//     {
//         let lock = self.connection.lock().expect("Mutex poisoned");
//         match lock.as_ref() {
//             Some(conn) => Ok(f(conn)),
//             None => Err(DBManagerError::NoConnection),
//         }
//     }

//     pub fn with_connection_mut<F, R>(&mut self, f: F) -> Result<R, DBManagerError>
//     where
//         F: FnOnce(&mut Connection) -> R,
//     {
//         let mut lock = self.connection.lock().expect("Mutex poisoned");
//         match lock.as_mut() {
//             Some(conn) => Ok(f(conn)),
//             None => Err(DBManagerError::NoConnection),
//         }
//     }
// }

use std::sync::{Arc, Mutex};

use rusqlite::Connection;

use crate::services::password_storage_service::{DBManagerError, PasswordStorageService};

#[derive(Debug)]
pub struct DBManager {
    service: Arc<Mutex<PasswordStorageService>>,
}

impl DBManager {
    pub fn get_service(&self) -> Arc<Mutex<PasswordStorageService>> {
        self.service.clone()
    }
}

impl Default for DBManager {
    fn default() -> Self {
        Self {
            service: Arc::new(Mutex::new(PasswordStorageService {
                connection: None,
                path: None,
            })),
        }
    }
}

impl DBManager {
    /// Executes a closure with a reference to the database connection.
    pub fn with_connection<F, R>(&self, f: F) -> Result<R, DBManagerError>
    where
        F: FnOnce(&Connection) -> R,
    {
        let service = self
            .service
            .lock()
            .map_err(|_| DBManagerError::NoConnection)?;
        match &service.connection {
            Some(conn) => Ok(f(conn)),
            None => Err(DBManagerError::NoConnection),
        }
    }

    /// Executes a closure with a mutable reference to the database connection.
    pub fn with_connection_mut<F, R>(&self, f: F) -> Result<R, DBManagerError>
    where
        F: FnOnce(&mut Connection) -> R,
    {
        let mut service = self
            .service
            .lock()
            .map_err(|_| DBManagerError::NoConnection)?;
        match &mut service.connection {
            Some(conn) => Ok(f(conn)),
            None => Err(DBManagerError::NoConnection),
        }
    }
}

impl DBManager {
    /// Выполняет замыкание с иммутабельной ссылкой на PasswordStorageService.
    pub fn get_service_ref<F, R>(&self, f: F) -> Result<R, DBManagerError>
    where
        F: FnOnce(&PasswordStorageService) -> R,
    {
        let service = self.service.lock().map_err(|_| DBManagerError::NoConnection)?;
        Ok(f(&service))
    }

    /// Выполняет замыкание с мутабельной ссылкой на PasswordStorageService.
    pub fn get_service_ref_mut<F, R>(&self, f: F) -> Result<R, DBManagerError>
    where
        F: FnOnce(&mut PasswordStorageService) -> R,
    {
        let mut service = self.service.lock().map_err(|_| DBManagerError::NoConnection)?;
        Ok(f(&mut service))
    }
}
