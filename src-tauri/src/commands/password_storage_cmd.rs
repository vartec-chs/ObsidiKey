use log::info;
use tauri::{command, State};

use crate::{
    dto::password_storage_dto::{PasswordStorageCreateDto, PasswordStorageOpenDto},
    states::db_manager::DBManager,
    utils::{
        api_result::{ApiAnswer, ApiResult},
        check_path::{check_is_not_exists, check_path},
    },
};

#[command]
pub async fn create_password_storage_cmd(
    dto: PasswordStorageCreateDto,
    db_manager: State<'_, DBManager>,
) -> ApiResult {
    info!(
        "Создание нового хранилища паролей: {:?}",
        dto.name
    );
    let path = check_is_not_exists(&dto.path)?; // Проверка существования пути

    let result = db_manager
        .with_service_ref_mut(|service| service.create(dto.into(), path))
        .map_err(ApiAnswer::<()>::from)?;

    info!("Результат создания хранилища паролей: {:#?}", result);

    Ok(ApiAnswer::success(200, "Успешно", None))
}

#[command]
pub async fn open_password_storage_cmd(
    dto: PasswordStorageOpenDto,
    db_manager: State<'_, DBManager>,
) -> ApiResult {
    info!("Открытие хранилища паролей: {}", dto.path);
    let path = check_path(&dto.path)?; // Проверка существования пути
    let result = db_manager
        .with_service_ref_mut(|service| service.open(path, dto.master_password))
        .map_err(ApiAnswer::<()>::from)?;

    info!("Результат открытия хранилища паролей: {:#?}", result);

    Ok(ApiAnswer::success(200, "Успешно", None))
}

#[command]
pub async fn close_password_storage_cmd(
    db_manager: State<'_, DBManager>,
    app_handle: tauri::AppHandle,
) -> ApiResult {
    info!("Закрытие соединения с базой данных.");
    let _ = db_manager
        .with_service_ref_mut(|service| service.close(&app_handle))
        .map_err(ApiAnswer::<()>::from)?;
    Ok(ApiAnswer::success(200, "Успешно", None))
}
