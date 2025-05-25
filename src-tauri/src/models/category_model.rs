use serde::{Deserialize, Serialize};
use uuid::Uuid;

use crate::dto::category_dto::CreateCategoryDto;

#[derive(Debug, Serialize, Deserialize)]
pub struct CategoryModel {
    pub id: String,
    pub name: String,
    pub description: Option<String>,
    pub icon_id: Option<String>,
    pub created_at: String,
    pub updated_at: String,
}

impl CategoryModel {
    pub fn new(name: String, description: Option<String>, icon_id: Option<String>) -> Self {
        let date = chrono::Utc::now().to_rfc3339();

        Self {
            id: Uuid::new_v4().to_string(),
            name,
            description,
            icon_id,
            created_at: date.clone(),
            updated_at: date,
        }
    }

    pub fn init(
        id: String,
        name: String,
        description: Option<String>,
        icon_id: Option<String>,
        created_at: String,
        updated_at: String,
    ) -> Self {
        Self {
            id,
            name,
            description,
            icon_id,
            created_at,
            updated_at,
        }
    }
}

impl From<CreateCategoryDto> for CategoryModel {
    fn from(dto: CreateCategoryDto) -> Self {
        Self::new(dto.name, dto.description, dto.icon_id)
    }
}
