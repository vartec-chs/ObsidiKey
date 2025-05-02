import { FC, memo, PropsWithChildren, useCallback } from 'react'

import { Box, Divider, Drawer, IconButton, Portal, styled, useTheme } from '@mui/material'

import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'

import { drawerWidth } from '@layouts/DashboardLayout'

import { useSidebar } from '@providers/SidebarProvider'

import { CategoryList } from './components/CategoryList'
import { SelectStorageMode } from './components/SelectStorageMode'
import { TagsList } from './components/TagsList'

export { DrawerToggleButton } from './components/DrawerToggleButton'

const MainBox = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
	open?: boolean
}>(({ theme }) => ({
	flexGrow: 1,
	height: '100%',
	transition: theme.transitions.create('margin', {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.leavingScreen,
	}),
	marginLeft: `-${drawerWidth}px`,
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
	],
}))

export const Main: FC<PropsWithChildren> = ({ children }) => {
	const { isStatic } = useSidebar()

	return (
		<MainBox open={isStatic} sx={{ display: 'flex', flexDirection: 'column' }}>
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
	const { isOpen, isStatic, toggleSidebar } = useSidebar()

	const isDrawerOpen = isStatic || isOpen

	return (
		<Drawer
			sx={(theme) => ({
				position: 'relative',
				width: drawerWidth,
				flexShrink: 0,
				'& .MuiDrawer-paper': {
					position: 'relative',
					padding: theme.spacing(0.5, 1),
					display: 'flex',
					flexDirection: 'column',
					gap: theme.spacing(0.5),
					width: drawerWidth,
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
						{/* {theme.direction === 'ltr' ? ( */}
						<ChevronLeftIcon size={22} />
						{/* ) : ( */}
						{/* <ChevronRightIcon size={22} /> */}
						{/* )} */}
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
