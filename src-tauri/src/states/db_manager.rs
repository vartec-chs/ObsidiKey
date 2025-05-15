use std::sync::{Arc, Mutex};

use rusqlite::Connection;

use crate::services::password_storage_service::{DBManagerError, PasswordStorageService};

#[derive(Debug)]
pub struct DBManager {
    service: Arc<Mutex<PasswordStorageService>>,
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

    /// Выполняет замыкание с иммутабельной ссылкой на PasswordStorageService.
    pub fn with_service_ref<F, R>(&self, f: F) -> Result<R, DBManagerError>
    where
        F: FnOnce(&PasswordStorageService) -> R,
    {
        let service = self
            .service
            .lock()
            .map_err(|_| DBManagerError::NoConnection)?;
        Ok(f(&service))
    }

    /// Выполняет замыкание с мутабельной ссылкой на PasswordStorageService.
    pub fn with_service_ref_mut<F, R>(&self, f: F) -> Result<R, DBManagerError>
    where
        F: FnOnce(&mut PasswordStorageService) -> R,
    {
        let mut service = self
            .service
            .lock()
            .map_err(|_| DBManagerError::NoConnection)?;
        Ok(f(&mut service))
    }
}
