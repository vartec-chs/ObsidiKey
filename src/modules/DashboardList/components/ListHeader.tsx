import { ModTextField } from '@/ui/ModTextField'
import { DrawerToggleButton } from '@modules/DashboardSidebar'

import { FC, useState } from 'react'

import { IconButton, InputAdornment, Stack, TextField, Typography } from '@mui/material'

import { SearchIcon } from 'lucide-react'

import { HeaderMenu } from './HeaderMenu'

export const ListHeader: FC = () => {
	const [open, setOpen] = useState(false)

	return (
		<Stack
			component='header'
			direction='row'
			alignItems='center'
			// justifyContent='space-between'
			width='100%'
			gap={0.5}
			pt={1}
			px={0.5}
			
			// border={1}
		>
			<DrawerToggleButton />
			<TextField
				fullWidth
				label='Поиск'
				sx={{
					'& .MuiInputBase-root': {
						padding: 0,
						paddingRight: 0.5,
					},
				}}
				onFocus={() => setOpen(true)}
				onBlur={() => setOpen(false)}
				placeholder='Поиск в категории Все'
				size='small'
				slotProps={
					open
						? {
								input: {
									endAdornment: (
										<InputAdornment position='end'>
											<IconButton size='small' sx={{ borderRadius: 0.8 }}>
												<SearchIcon size={18} />
											</IconButton>
										</InputAdornment>
									),
								},
							}
						: {}
				}
			/>
			<HeaderMenu />
		</Stack>
	)
}
