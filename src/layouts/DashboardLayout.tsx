import { DashboardRightbar } from '@modules/DashboardRightbar'
import { DashboardSidebar, Main } from '@modules/DashboardSidebar'

import type { FC } from 'react'
import { Outlet } from 'react-router'

import { Box } from '@mui/material'

import { SidebarProvider } from '@providers/SidebarProvider'

export const drawerWidth = 260

export const DashboardLayout: FC = () => {
	console.log('rerender layout')
	return (
		<SidebarProvider>
			<Box sx={{ display: 'flex', position: 'relative', height: '100%' }}>
				<DashboardSidebar />
				<Main>
					<Outlet />
				</Main>
				<DashboardRightbar />
			</Box>
		</SidebarProvider>
	)
}
