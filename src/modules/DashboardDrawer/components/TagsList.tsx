// import { TagModal } from '@modules'
import { type FC } from 'react'

import { Box, List, Stack, Typography } from '@mui/material'

import { TagIcon } from 'lucide-react'

import { ListItem } from './ListItem'

export const TagsList: FC = () => {
	const tags = Array.from({ length: 10 })

	return (
		<Stack sx={{ width: '100%', overflow: 'hidden', height: '50%', pr: 0.2 }} gap={1}>
			<Stack direction='row' alignItems='center' gap={1} justifyContent='space-between'>
				<Stack direction='row' alignItems='center' gap={1}>
					<TagIcon size={20} />
					<Typography variant='body2'>Теги:</Typography>
				</Stack>

				{/* <TagModal /> */}
			</Stack>
			<Box
				sx={(theme) => ({
					width: '100%',
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
				<List sx={{ width: '100%', overflow: 'hidden', pr: 0.2 }}>
					{tags.map((_, index) => (
						<ListItem index={index} isEnd={index === 1} title='Tag' />
					))}
				</List>
			</Box>
		</Stack>
	)
}
