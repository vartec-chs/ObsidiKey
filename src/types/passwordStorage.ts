type PasswordStorageCreateDto = {
	name: string
	description?: string
	path: string
	masterPassword: string
}

type PasswordStorageOpenDto = {
	path: string
	masterPassword: string
}

export type { PasswordStorageCreateDto, PasswordStorageOpenDto }
