import { ModTextField } from '@/ui/ModTextField'
import { DrawerToggleButton } from '@modules/DashboardSidebar'

import { FC, useState } from 'react'

import { IconButton, InputAdornment, Stack, TextField, Typography } from '@mui/material'

import { SearchIcon } from 'lucide-react'

import { Search } from './Search'

import { HeaderMenu } from '../HeaderMenu'

export const ListHeader: FC = () => {
	return (
		<Stack
			component='header'
			direction='row'
			alignItems='center'
			width='100%'
			height={56}
			gap={0.5}
			pt={1}
			px={0.5}
		>
			<DrawerToggleButton />
			<Search />
			<HeaderMenu />
		</Stack>
	)
}
