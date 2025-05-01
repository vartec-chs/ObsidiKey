import * as z from 'zod'

export const categorySchema = z.object({
	name: z
		.string({
			message: 'Название категории должно быть строкой',
		})
		.min(1, 'Название категории не может быть пустым')
		.describe('Название категории'),
	description: z
		.string({
			message: 'Описание категории должно быть строкой',
		})
		.describe('Описание категории')
		.optional(),
	iconPath: z
		.string({
			message: 'Иконка категории должна быть строкой',
		})
		.optional()
		.describe('Иконка категории'),
	icon: z
		.string({
			message: 'Иконка категории должна быть строкой',
		})
		.optional()
		.describe('Иконка категории'),
})

export type CategorySchema = z.infer<typeof categorySchema>
