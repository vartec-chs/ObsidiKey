import { FC, memo, PropsWithChildren, useCallback } from 'react'

import { Box, Divider, Drawer, IconButton, Portal, styled, useTheme } from '@mui/material'

import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'

import { useSidebar } from '@providers/SidebarProvider'

import { CategoryList } from './components/CategoryList'
import { SelectStorageMode } from './components/SelectStorageMode'
import { TagsList } from './components/TagsList'

export { DrawerToggleButton } from './components/DrawerToggleButton'

const MainBox = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
	open?: boolean
	openRightbar?: boolean
	drawerWidth?: number
	rightbarWidth?: number
}>(({ theme, rightbarWidth, drawerWidth }) => ({
	flexGrow: 1,
	height: '100%',
	transition: theme.transitions.create('margin', {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.leavingScreen,
	}),
	marginLeft: `-${drawerWidth}px`,
	marginRight: `-${rightbarWidth}px`,
	variants: [
		{
			props: ({ open }) => open,
			style: {
				transition: theme.transitions.create('margin', {
					easing: theme.transitions.easing.easeOut,
					duration: theme.transitions.duration.enteringScreen,
				}),
				marginLeft: 0,
			},
		},
		{
			props: ({ openRightbar }) => openRightbar,
			style: {
				transition: theme.transitions.create('margin', {
					easing: theme.transitions.easing.easeOut,
					duration: theme.transitions.duration.enteringScreen,
				}),
				marginRight: 0,
			},
		},
		{
			props: ({ open, openRightbar }) => open && openRightbar,
			style: {
				marginLeft: 0,
				marginRight: 0,
			},
		},
	],
}))

export const Main: FC<PropsWithChildren> = ({ children }) => {
	const { isStatic, isStaticRightbar, isOpenRightbar, width } = useSidebar()
	console.log('Main', { isStatic, isStaticRightbar, isOpenRightbar, width })

	return (
		<MainBox
			open={isStatic}
			openRightbar={isStaticRightbar || isOpenRightbar}
			drawerWidth={width.sidebar}
			rightbarWidth={width.rightbar}
			sx={{ display: 'flex', flexDirection: 'column' }}
		>
			{children}
		</MainBox>
	)
}

const DrawerHeader = styled('div')(({ theme }) => ({
	display: 'flex',
	alignItems: 'center',
	gap: 0,
	padding: theme.spacing(0, 0),
	justifyContent: 'space-between',
}))

export const DashboardSidebar: FC = memo(() => {
	const { isOpen, isStatic, toggleSidebar, width } = useSidebar()

	const isDrawerOpen = isStatic || isOpen

	return (
		<Drawer
			sx={(theme) => ({
				position: 'relative',
				width: width.sidebar,
				flexShrink: 0,
				'& .MuiDrawer-paper': {
					position: 'relative',
					padding: theme.spacing(0.5, 1),
					display: 'flex',
					flexDirection: 'column',
					gap: theme.spacing(0.5),
					width: width.sidebar,
					boxSizing: 'border-box',
					borderRight: `2px solid ${theme.palette.divider}`,
				},
			})}
			variant={isStatic ? 'permanent' : 'persistent'}
			anchor='left'
			open={isDrawerOpen}
		>
			<DrawerHeader>
				<SelectStorageMode />
				{!isStatic && (
					<IconButton size='small' onClick={toggleSidebar}>
						<ChevronLeftIcon size={22} />
					</IconButton>
				)}
			</DrawerHeader>
			<Divider
				sx={(theme) => ({
					border: `0.5px solid ${theme.palette.divider}`,
				})}
			/>
			<CategoryList />
			<Divider
				sx={(theme) => ({
					border: `0.5px solid ${theme.palette.divider}`,
				})}
			/>
			<TagsList />
		</Drawer>
	)
})
