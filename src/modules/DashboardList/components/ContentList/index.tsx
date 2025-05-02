import { FC } from 'react'

import { Box, Stack } from '@mui/material'

import { PasswordCard } from './components'

export const ContentList: FC = () => {
	return (
		<Box sx={{ width: '100%', height: '100%', p: 0.5, overflow: 'hidden' }}>
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
				<Stack gap={0.5} direction='column' pr={0.5}>
					{Array.from({ length: 20 }).map((_, index) => (
						<PasswordCard id={index.toString()} key={index} />
					))}
				</Stack>
			</Box>
		</Box>
	)
}
