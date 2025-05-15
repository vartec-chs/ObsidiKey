use crate::utils::api_result::*;
use std::path::PathBuf;

pub fn check_path(path: &str) -> Result<PathBuf, ApiAnswer<()>> {
    let path = PathBuf::from(path);
    if path.exists() {
        Ok(path)
    } else {
        let error = ApiAnswer::error(
            ApiError::FSError {
                0: ErrorDetails {
                    code: 400,
                    message: "путь не существует".to_string(),
                },
            },
            None,
        );
        Err(error)
    }
}

pub fn check_is_not_exists(path: &str) -> Result<PathBuf, ApiAnswer<()>> {
    let path = PathBuf::from(path);
    if path.exists() {
        let error = ApiAnswer::error(
            ApiError::FSError {
                0: ErrorDetails {
                    code: 400,
                    message: "путь уже существует".to_string(),
                },
            },
            None,
        );
        Err(error)
    } else {
        Ok(path)
    }
}
