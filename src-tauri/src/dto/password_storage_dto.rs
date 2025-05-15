use serde::Deserialize;

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PasswordStorageCreateDto {
    pub name: String,
    pub description: String,
    pub path: String,
    pub master_password: String,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct OpenStoreDto {
    pub path: String,
    pub master_password: String,
}
