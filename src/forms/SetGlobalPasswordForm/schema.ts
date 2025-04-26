import { zodResolver } from '@hookform/resolvers/zod'

import { z } from 'zod'

export const setGlobalPasswordSchema = z
	.object({
		password: z.string().min(1, 'Пароль должен содержать не менее 1 символ'),
		confirmPassword: z.string().min(1, 'Пароль должен содержать не менее 1 символ'),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: 'Пароли не совпадают',
		path: ['confirmPassword'],
	})

export type SetGlobalPasswordSchema = z.infer<typeof setGlobalPasswordSchema>

export const setGlobalPasswordResolver = zodResolver(setGlobalPasswordSchema)
