use crate::constants::error_consts::*;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ApiAnswer<T> {
    pub is_success: bool,
    pub status_code: u32,
    pub message: String,
    pub data: Option<T>,
}

pub type ApiResult<S = (), E = ()> = std::result::Result<ApiAnswer<S>, ApiAnswer<E>>;

impl<T> ApiAnswer<T> {
    /// Универсальный конструктор для ApiAnswer
    fn new(
        is_success: bool,
        status_code: u32,
        message: impl Into<String>,
        data: Option<T>,
    ) -> Self {
        Self {
            is_success,
            status_code,
            message: message.into(),
            data,
        }
    }

    /// Успешный ответ с кастомным кодом.
    /// Здесь передаётся числовой код, который форматируется с префиксом успеха (2).
    pub fn success(code: u16, message: impl Into<String>, data: Option<T>) -> Self {
        Self::new(
            true,
            format_status_code(PREFIX_SUCCESS, code),
            message,
            data,
        )
    }

    /// Ответ с ошибкой, в который можно передать полезные данные.
    pub fn error(error: ApiError, data: Option<T>) -> Self {
        Self::new(false, error.status_code(), error.to_string(), data)
    }

    pub fn success_with_prefix(
        prefix: u8,
        code: u16,
        message: impl Into<String>,
        data: Option<T>,
    ) -> Self {
        Self::new(true, format_status_code(prefix, code), message, data)
    }
}

/// Функция для формирования полного кода: конкатенирует префикс и код
fn format_status_code(prefix: u8, code: u16) -> u32 {
    if prefix > 9 || code > 9999 {
        return 0; // или можно вернуть ошибку через Result
    }
    (prefix as u32) * 10000 + (code as u32)
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ErrorDetails {
    pub code: u16,
    pub message: String,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub enum ApiError {
    DBError(ErrorDetails),
    ValidationError(ErrorDetails),
    NotFound(ErrorDetails),
    InternalError(ErrorDetails),
    AccessError(ErrorDetails),
    PasswordGeneratorError(ErrorDetails),
    FSError(ErrorDetails),
}

impl ApiError {
    pub fn status_code(&self) -> u32 {
        let (prefix, details) = match self {
            ApiError::DBError(details) => (PREFIX_DB, details),
            ApiError::ValidationError(details) => (PREFIX_VALIDATION, details),
            ApiError::NotFound(details) => (PREFIX_NOT_FOUND, details),
            ApiError::InternalError(details) => (PREFIX_INTERNAL, details),
            ApiError::AccessError(details) => (PREFIX_ACCESS, details),
            ApiError::PasswordGeneratorError(details) => (PREFIX_PASSWORD_GEN, details),
            ApiError::FSError(details) => (PREFIX_FS, details),
        };
        format_status_code(prefix, details.code)
    }
}

impl std::fmt::Display for ApiError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        let (prefix, details) = match self {
            ApiError::DBError(details) => ("Ошибка БД", details),
            ApiError::ValidationError(details) => ("Ошибка валидации", details),
            ApiError::NotFound(details) => ("Не найдено", details),
            ApiError::InternalError(details) => ("Неизвестная ошибка", details),
            ApiError::AccessError(details) => ("Ошибка доступа", details),
            ApiError::PasswordGeneratorError(details) => ("Ошибка генератора паролей", details),
            ApiError::FSError(details) => ("Ошибка работы с файловой системой", details),
        };
        write!(f, "{}: {}", prefix, details.message)
    }
}
pub fn handle_command<T, F>(f: F) -> ApiAnswer<T>
where
    F: FnOnce() -> Result<T, ApiError> + std::panic::UnwindSafe,
{
    match std::panic::catch_unwind(f) {
        Ok(Ok(data)) => ApiAnswer::success(0, "Успешно", Some(data)),
        Ok(Err(err)) => ApiAnswer::error(err, None),
        Err(panic_err) => {
            // Логирование паники (пример с использованием log)
            log::error!("Паника в handle_command: {:?}", panic_err);
            ApiAnswer::error(
                ApiError::InternalError {
                    0: ErrorDetails {
                        code: 1,
                        message: "Неожиданная ошибка (panic)".into(),
                    },
                },
                None,
            )
        }
    }
}
