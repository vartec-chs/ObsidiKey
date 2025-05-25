use base64::{engine::general_purpose, Engine as _};
use rusqlite::{Connection, OptionalExtension, Result};

use crate::dto::category_dto::{CategoryDto, CreateCategoryDto, IconDto, UpdateCategoryDto};
use crate::models::category_model::CategoryModel;

pub struct CategoryService;

impl CategoryService {
    pub fn create(conn: &Connection, dto: CreateCategoryDto) -> Result<CategoryDto> {
        let category = CategoryModel::from(dto);

        conn.execute(
            r#"
    INSERT INTO categories (id, name, description, icon_id, created_at, updated_at)
    VALUES (?1, ?2, ?3, ?4, ?5, ?6)
    "#,
            rusqlite::params![
                &category.id,
                &category.name,
                &category.description, // Now handled correctly as Option<String>
                &category.icon_id,     // Now handled correctly as Option<String>
                &category.created_at,
                &category.updated_at,
            ],
        )?;

        Self::get_by_id(conn, &category.id)
    }

    pub fn get_by_id(conn: &Connection, id: &str) -> Result<CategoryDto> {
        let category = conn.query_row(
            r#"
            SELECT id, name, description, icon_id, created_at, updated_at
            FROM categories WHERE id = ?1
            "#,
            [id],
            |row| {
                Ok(CategoryModel::init(
                    row.get(0)?,
                    row.get(1)?,
                    row.get(2)?,
                    row.get(3)?,
                    row.get(4)?,
                    row.get(5)?,
                ))
            },
        )?;

        // Получение иконки
        let icon = if let Some(icon_id) = &category.icon_id {
            conn.query_row(
                "SELECT id, name, mime_type, data FROM icons WHERE id = ?1",
                [icon_id],
                |row| {
                    let data: Vec<u8> = row.get(3)?;
                    Ok(IconDto {
                        id: row.get(0)?,
                        name: row.get(1)?,
                        mime_type: row.get(2)?,
                        data: general_purpose::STANDARD.encode(&data),
                    })
                },
            )
            .optional()?
        } else {
            None
        };

        Ok(CategoryDto {
            id: category.id,
            name: category.name,
            description: category.description,
            icon,
            created_at: category.created_at,
            updated_at: category.updated_at,
        })
    }

    pub fn get_all(conn: &Connection) -> Result<Vec<CategoryDto>> {
        let mut stmt = conn.prepare(
            r#"
            SELECT id, name, description, icon_id, created_at, updated_at
            FROM categories
            "#,
        )?;
        let categories = stmt
            .query_map([], |row| {
                Ok(CategoryModel::init(
                    row.get(0)?,
                    row.get(1)?,
                    row.get(2)?,
                    row.get(3)?,
                    row.get(4)?,
                    row.get(5)?,
                ))
            })?
            .collect::<Result<Vec<CategoryModel>>>()?;

        let mut result = Vec::new();
        for category in categories {
            let icon = if let Some(icon_id) = &category.icon_id {
                conn.query_row(
                    "SELECT id, name, mime_type, data FROM icons WHERE id = ?1",
                    [icon_id],
                    |row| {
                        let data: Vec<u8> = row.get(3)?;
                        Ok(IconDto {
                            id: row.get(0)?,
                            name: row.get(1)?,
                            mime_type: row.get(2)?,
                            data: general_purpose::STANDARD.encode(&data),
                        })
                    },
                )
                .optional()?
            } else {
                None
            };

            result.push(CategoryDto {
                id: category.id,
                name: category.name,
                description: category.description,
                icon,
                created_at: category.created_at,
                updated_at: category.updated_at,
            });
        }

        Ok(result)
    }

    pub fn update(conn: &Connection, id: &str, dto: UpdateCategoryDto) -> Result<CategoryDto> {
        let updated_at = chrono::Utc::now().to_rfc3339();
        let mut updates = Vec::new();
        let mut params: Vec<&dyn rusqlite::ToSql> = Vec::new();

        if let Some(name) = &dto.name {
            updates.push("name = ?");
            params.push(name as &dyn rusqlite::ToSql); // Добавляем дополнительное заимствование
        }
        if let Some(description) = &dto.description {
            updates.push("description = ?");
            params.push(description as &dyn rusqlite::ToSql); // Добавляем дополнительное заимствование
        }
        if let Some(icon_id) = &dto.icon_id {
            updates.push("icon_id = ?");
            params.push(icon_id as &dyn rusqlite::ToSql); // Добавляем дополнительное заимствование
        }
        updates.push("updated_at = ?");
        params.push(&updated_at as &dyn rusqlite::ToSql); // Добавляем дополнительное заимствование

        if !updates.is_empty() {
            let query = format!("UPDATE categories SET {} WHERE id = ?", updates.join(", "));
            params.push(&id as &dyn rusqlite::ToSql); // Добавляем дополнительное заимствование
            conn.execute(&query, rusqlite::params_from_iter(params))?;
        }

        Self::get_by_id(conn, id)
    }

    pub fn delete(conn: &Connection, id: &str) -> Result<()> {
        conn.execute("DELETE FROM categories WHERE id = ?1", [id])?;
        Ok(())
    }
}
