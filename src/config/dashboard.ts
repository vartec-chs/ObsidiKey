// import { ResizeCondition } from '@/hooks'

import { HomeIcon, KeyRoundIcon, NotebookIcon, SquareAsteriskIcon, StarIcon } from 'lucide-react'

type BASE = {
	name: string
	icon: typeof StarIcon
}

export const BASE_FILTER: Record<string, BASE> = {
	ALL: {
		name: 'All',
		icon: HomeIcon,
	},
	FAVORITE: {
		name: 'Favorite',
		icon: StarIcon,
	},
}
export enum STORAGE_NAME {
	PASSWORDS = 'passwords',
	AUTHENTICATION = 'authentication',
	NOTES = 'notes',
}

export const STORAGE_TYPE: Record<string, { disabled: boolean } & BASE> = {
	PASSWORDS: {
		name: 'Passwords',
		icon: SquareAsteriskIcon,
		disabled: false,
	},
	AUTHENTICATION: {
		name: 'Authentication',
		icon: KeyRoundIcon,
		disabled: false,
	},
	NOTES: {
		name: 'Notes',
		icon: NotebookIcon,
		disabled: true,
	},
}

// export const MATCHES: ResizeCondition[] = [
// 	{ id: 'mobile', match: ({ width }) => width < 600 },
// 	{ id: 'tablet', match: ({ width }) => width >= 900 },
// ]
