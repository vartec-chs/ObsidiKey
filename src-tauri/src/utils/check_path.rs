use crate::utils::api_result::*;
use std::path::PathBuf;

pub fn check_path(path: &str) -> Result<PathBuf, ApiAnswer<()>> {
    let path = PathBuf::from(path);
    if path.exists() {
        Ok(path)
    } else {
        Err(ApiAnswer::error(
            ApiError::InternalError {
                0: ErrorDetails {
                    code: 400,
                    message: "Путь не существует".to_string(),
                },
            },
            None,
        ))
    }
}
