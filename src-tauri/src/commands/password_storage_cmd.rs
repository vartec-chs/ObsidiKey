use log::{error, info};
use std::path::{Path, PathBuf};
use tauri::{command, AppHandle, Manager, State};

use crate::{
    dto::password_storage_dto::PasswordStorageCreateDto,
    services::password_storage_service::DBManagerError,
    states::db_manager::DBManager,
    utils::api_result::{handle_command, ApiError, ApiResult, ErrorDetails},
};

#[command]
pub fn create_password_storage_cmd(
    dto: PasswordStorageCreateDto,
    db_manager: State<'_, DBManager>,
) -> Result<ApiResult<()>, ApiResult<()>> {
    info!("Создание нового хранилища паролей: {:?}", dto.name);
    let path = PathBuf::from(dto.path.clone());

    if path.exists() {
        error!("Путь не существует: {:#?}", &path);
        return Err(ApiResult::error(
            ApiError::InternalError {
                0: ErrorDetails {
                    code: 400,
                    message: "Путь не существует".to_string(),
                },
            },
            None,
        ));
    }

    let res = db_manager.get_service_ref_mut(|service| match service.create(dto.into(), path) {
        Ok(_) => {
            info!("Хранилище паролей успешно создано");
            return Ok(ApiResult::success(
                200,
                "Хранилище паролей успешно создано",
                None,
            ));
        }

        Err(err) => {
            let api_error = match err {
                DBManagerError::Database(err) => ApiError::DBError {
                    0: ErrorDetails {
                        code: 500,
                        message: "Ошибка базы данных".to_string(),
                    },
                },
                DBManagerError::InvalidKey => ApiError::DBError {
                    0: ErrorDetails {
                        code: 400,
                        message: "Неверный ключ".to_string(),
                    },
                },
                DBManagerError::NoConnection => ApiError::DBError {
                    0: ErrorDetails {
                        code: 400,
                        message: "Нет соединения".to_string(),
                    },
                },
            };
            return Err(ApiResult::error(api_error, None));
        }
    });

    match res {
        Ok(_) => {
            Ok(()) => {
                info!("Хранилище паролей успешно создано");
                return Ok(ApiResult::success(
                    200,
                    "Хранилище паролей успешно создано",
                    None,
                ));
            },
            Err(err) => {
                return Err(ApiResult::error(
                    ApiError::InternalError {
                        0: ErrorDetails {
                            code: 500,
                            message: format!("Ошибка: {}", err),
                        }
                    }
                ))
            }
			};
        },
        Err(err) => {
            return Err(ApiResult::error(
                ApiError::InternalError {
                    0: ErrorDetails {
                        code: 500,
                        message: format!("Ошибка: {}", err),
                    },
                },
                None,
            ))
        }
    }
}
