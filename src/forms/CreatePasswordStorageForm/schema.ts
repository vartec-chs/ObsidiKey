import * as z from 'zod'

export const createPasswordStorageSchema = z.object({
	name: z
		.string({
			message: 'Название хранилища паролей должно быть строкой',
		})
		.describe('Название хранилища паролей'),
	description: z
		.string({
			message: 'Описание хранилища паролей должно быть строкой',
		})
		.describe('Описание хранилища паролей')
		.optional(),
	masterPassword: z
		.string({
			message: 'Ключ шифрования должен быть строкой',
		})
		.describe('Ключ шифрования'),
})

export type CreatePasswordStorageSchema = z.infer<typeof createPasswordStorageSchema>
