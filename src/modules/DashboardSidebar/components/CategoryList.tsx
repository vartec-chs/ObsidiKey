// import { CategoryModal } from '@modules'
import { BASE_FILTER } from '@config/dashboard'
import { CategoryModal } from '@modules/CategoryModal'

import { type FC } from 'react'

import { Box, Divider, List, Stack, Typography } from '@mui/material'

import { FoldersIcon, Plus, User2 } from 'lucide-react'

import { ListItem } from './ListItem'

export const CategoryList: FC = () => {
	const categories = Array.from({ length: 10 })

	console.log('rerender list')

	return (
		<Stack sx={{ width: '100%', overflow: 'hidden', height: '50%', pr: 0 }} gap={1}>
			<Stack direction='row' alignItems='center' gap={1} justifyContent='space-between'>
				<Stack direction='row' alignItems='center' gap={1}>
					<FoldersIcon size={20} />
					<Typography variant='body2'>Категории:</Typography>
				</Stack>

				{/* <IconButton size='small'>
					<Plus size={20} />
				</IconButton> */}
				<CategoryModal />
			</Stack>
			<Box
				sx={(theme) => ({
					width: '100%',

					height: '100%',
					overflow: 'auto',
					scrollbarGutter: 'stable', // резервируем место под скроллбар

					'&::-webkit-scrollbar': {
						width: '4px', // Ширина скроллбара
					},
					'&::-webkit-scrollbar-track': {
						background: theme.palette.mode === 'dark' ? '#222' : '#f0f0f0', // Цвет фона
						borderRadius: '8px',
					},
					'&::-webkit-scrollbar-thumb': {
						background: theme.palette.mode === 'dark' ? '#444' : '#bbb', // Цвет ползунка
						borderRadius: '8px',
						'&:hover': {
							background: theme.palette.mode === 'dark' ? '#666' : '#999', // Цвет при наведении
						},
					},
				})}
			>
				<List sx={{ width: '100%', overflow: 'hidden', pr: 0.2, position: 'relative' }}>
					{Object.entries(BASE_FILTER).map(([key, value]) => (
						<ListItem
							index={Number(key)}
							isEnd={Number(key) === Object.keys(BASE_FILTER).length - 1}
							icon={<value.icon size={20} />}
							title={value.name}
						/>
					))}

					{categories.length > 0 && <Divider />}
					{categories.map((_, index) => (
						<ListItem
							index={index}
							isEnd={index === 0}
							icon={<User2 size={20} />}
							title='Category'
						/>
					))}
				</List>
			</Box>
		</Stack>
	)
}
