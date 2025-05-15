use crate::dto::password_storage_dto::PasswordStorageCreateDto;
use chrono::Utc;

#[derive(Debug, Clone)]
pub struct PasswordStorageModel {
    pub id: i8,
    pub name: String,
    pub description: Option<String>,
    pub master_password: String,

    pub created_at: String,
    pub updated_at: String,
}

impl PasswordStorageModel {
    pub fn new(name: String, description: Option<String>, master_password: String) -> Self {
        let date = Utc::now().to_rfc3339();

        Self {
            id: 1,
            name,
            description,
            master_password,
            created_at: date.clone(),
            updated_at: date,
        }
    }

    pub fn init(
        id: i8,
        name: String,
        description: Option<String>,
        master_password: String,
        created_at: String,
        updated_at: String,
    ) -> Self {
        Self {
            id,
            name,
            description,
            master_password,
            created_at,
            updated_at,
        }
    }
}

impl From<PasswordStorageCreateDto> for PasswordStorageModel {
    fn from(dto: PasswordStorageCreateDto) -> Self {
        Self::new(dto.name, dto.description, dto.master_password)
    }
}
