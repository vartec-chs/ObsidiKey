use log::{error, info};
use tauri::{command, State};

use crate::{
    dto::password_storage_dto::{PasswordStorageCreateDto, PasswordStorageOpenDto},
    services::password_storage_service::DBManagerError,
    states::db_manager::DBManager,
    utils::{
        api_result::{ApiError, ApiResult, ErrorDetails},
        check_path::check_path,
    },
};

#[command]
pub async fn create_password_storage_cmd(
    dto: PasswordStorageCreateDto,
    db_manager: State<'_, DBManager>,
) -> Result<ApiResult<()>, ApiResult<()>> {
    info!("Создание нового хранилища паролей: {:?}", dto.name);
    let path = check_path(&dto.path)?; // Проверка существования пути

    let _ = db_manager
        .with_service_ref_mut(|service| service.create(dto.into(), path))
        .map_err(|e| {
            let (error_type, code, message) = match e {
                DBManagerError::Database(db_err) => (
                    ApiError::DBError as fn(ErrorDetails) -> ApiError,
                    500,
                    format!("Ошибка базы данных: {}", db_err),
                ),
                DBManagerError::InvalidKey => (
                    ApiError::ValidationError as fn(ErrorDetails) -> ApiError,
                    400,
                    "Недопустимый ключ".to_string(),
                ),
                DBManagerError::NoConnection => (
                    ApiError::InternalError as fn(ErrorDetails) -> ApiError,
                    500,
                    "Отсутствует соединение с базой данных".to_string(),
                ),
            };

            error!("Ошибка создания хранилища паролей: {}", message);
            ApiResult::error(error_type(ErrorDetails { code, message }), None)
        })?;

    Ok(ApiResult::success(200, "Успешно", None))
}

#[command]
pub async fn open_password_storage_cmd(
    dto: PasswordStorageOpenDto,
    db_manager: State<'_, DBManager>,
) -> Result<ApiResult<()>, ApiResult<()>> {
    info!("Открытие хранилища паролей: {}", dto.path);
    let path = check_path(&dto.path)?; // Проверка существования пути
    let _ = db_manager
        .with_service_ref_mut(|service| service.open(path, dto.master_password))
        .map_err(|e| {
            let (error_type, code, message) = match e {
                DBManagerError::Database(db_err) => (
                    ApiError::DBError as fn(ErrorDetails) -> ApiError,
                    500,
                    format!("Ошибка базы данных: {}", db_err),
                ),
                DBManagerError::InvalidKey => (
                    ApiError::ValidationError as fn(ErrorDetails) -> ApiError,
                    400,
                    "Недопустимый ключ".to_string(),
                ),
                DBManagerError::NoConnection => (
                    ApiError::InternalError as fn(ErrorDetails) -> ApiError,
                    500,
                    "Отсутствует соединение с базой данных".to_string(),
                ),
            };

            error!("Ошибка открытия хранилища паролей: {}", message);
            ApiResult::error(error_type(ErrorDetails { code, message }), None)
        })?;

    Ok(ApiResult::success(200, "Успешно", None))
}

#[command]
pub async fn close_password_storage_cmd(
    db_manager: State<'_, DBManager>,
    app_handle: tauri::AppHandle,
) -> Result<ApiResult<()>, ApiResult<()>> {
    info!("Закрытие соединения с базой данных.");
    let _ = db_manager
        .with_service_ref_mut(|service| service.close(&app_handle))
        .map_err(|e| {
            error!("Ошибка закрытия соединения с базой данных: {}", e);
            ApiResult::error(
                ApiError::InternalError(ErrorDetails {
                    code: 500,
                    message: e.to_string(),
                }),
                None,
            )
        })?;
    Ok(ApiResult::success(200, "Успешно", None))
}
