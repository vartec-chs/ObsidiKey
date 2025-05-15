use serde::Deserialize;

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PasswordStorageCreateDto {
    pub name: String,
    pub description: Option<String>,
    pub path: String,
    pub master_password: String,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PasswordStorageOpenDto {
    pub path: String,
    pub master_password: String,
}
