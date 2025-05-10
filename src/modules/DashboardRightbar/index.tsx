import { FC, memo, PropsWithChildren, useCallback, useState } from 'react'

import {
	Box,
	Divider,
	Drawer,
	IconButton,
	Portal,
	styled,
	Typography,
	useTheme,
} from '@mui/material'

import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'

import { useSidebar } from '@providers/SidebarProvider'

import { DashboardViewing } from './DashboardViewing'

const DrawerHeader = styled('div')(({ theme }) => ({
	display: 'flex',
	alignItems: 'center',
	gap: 0,
	padding: theme.spacing(0, 0),
	justifyContent: 'space-between',
}))

export const DashboardRightbar: FC = memo(() => {
	const { isOpenRightbar, isStaticRightbar, width } = useSidebar()

	
	const isDrawerOpen = useCallback(
		() => isStaticRightbar || isOpenRightbar,
		[isStaticRightbar, isOpenRightbar],
	)

	console.log('DashboardRightbar', { isOpenRightbar, isStaticRightbar, width })

	return (
		<Drawer
			sx={(theme) => ({
				position: 'relative',
				zIndex: isDrawerOpen() ? 800 : -10,
				width: width.rightbar,
				flexShrink: 0,
				'& .MuiDrawer-paper': {
					position: 'relative',
					padding: theme.spacing(0.5, 1),
					display: 'flex',
					flexDirection: 'column',
					gap: theme.spacing(0.5),
					width: width.rightbar,
					boxSizing: 'border-box',
					borderLeft: `2px solid ${theme.palette.divider}`,
				},
			})}
			variant={isStaticRightbar ? 'permanent' : 'persistent'}
			anchor='right'
			open={isDrawerOpen()}
		>
		
			<DashboardViewing />
		</Drawer>
	)
})
