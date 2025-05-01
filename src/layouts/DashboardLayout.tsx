import { DashboardSidebar, Main } from '@/modules/DashboardSidebar'

import { FC, useState } from 'react'
import { Outlet } from 'react-router'

import { Box } from '@mui/material'

export const drawerWidth = 260

export const DashboardLayout: FC = () => {
	const [open, setOpen] = useState(false)
	const isStatic = false

	const handleDrawerOpen = () => {
		setOpen(true)
	}

	const handleDrawerClose = () => {
		setOpen(false)
	}

	return (
		<Box sx={{ display: 'flex', position: 'relative', height: '100%' }}>
			<DashboardSidebar
				handleDrawerOpen={handleDrawerOpen}
				open={open}
				isStatic={isStatic}
				onClose={handleDrawerClose}
			/>
			<Main open={open || isStatic}>
				<Outlet />
			</Main>
		</Box>
	)
}
