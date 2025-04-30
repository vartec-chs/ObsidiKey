import { DrawerContent, Main } from '@modules/DashboardDrawer'
import { DrawerToggleButton } from '@modules/DashboardDrawer/components/DrawerToggleButton'

import { FC, useState } from 'react'
import { Outlet } from 'react-router'

import { Box, Drawer } from '@mui/material'

export const drawerWidth = 250

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
			<DrawerToggleButton isOpen={open} isStatic={isStatic} onClick={handleDrawerOpen} />
			<Drawer
				sx={(theme) => ({
					position: 'relative',
					width: drawerWidth,
					flexShrink: 0,

					'& .MuiDrawer-paper': {
						position: 'relative',
						padding: theme.spacing(1),
						display: 'flex',
						flexDirection: 'column',
						gap: theme.spacing(1),
						width: drawerWidth,
						boxSizing: 'border-box',
						borderRight: `2px solid ${theme.palette.divider}`,
					},
				})}
				variant={isStatic ? 'permanent' : 'persistent'}
				anchor='left'
				open={open}
			>
				<DrawerContent isStatic={isStatic} onClose={handleDrawerClose} />
			</Drawer>
			<Main open={open || isStatic}>
				<Outlet />
			</Main>
		</Box>
	)
}
