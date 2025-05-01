import { zodResolver } from '@hookform/resolvers/zod'

import { z } from 'zod'

export const TagSchema = z.object({
	name: z.string().min(1, 'Название не может быть пустым'),
})

export type TagSchema = z.infer<typeof TagSchema>

export const tagSchema = zodResolver(TagSchema)
