use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct CategoryDto {
    pub id: String,
    pub name: String,
    pub description: Option<String>,
    pub icon: Option<IconDto>,
    pub created_at: String,
    pub updated_at: String,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct IconDto {
    pub id: String,
    pub name: String,
    pub mime_type: String,
    // Данные иконки возвращаются как base64-строка для фронтенда
    pub data: String,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CreateCategoryDto {
    pub name: String,
    pub description: Option<String>,
    pub icon_id: Option<String>,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct UpdateCategoryDto {
    pub name: Option<String>,
    pub description: Option<String>,
    pub icon_id: Option<String>,
}
