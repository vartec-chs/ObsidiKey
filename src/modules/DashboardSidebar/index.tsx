import { FC } from 'react'

import { Divider, Drawer, IconButton, styled, useTheme } from '@mui/material'

import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'

import { drawerWidth } from '@layouts/DashboardLayout'

import { CategoryList } from './components/CategoryList'
import { DrawerToggleButton } from './components/DrawerToggleButton'
import { SelectStorageMode } from './components/SelectStorageMode'
import { TagsList } from './components/TagsList'

export const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
	open?: boolean
}>(({ theme }) => ({
	flexGrow: 1,
	height: '100%',
	// padding: theme.spacing(),
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

const DrawerHeader = styled('div')(({ theme }) => ({
	display: 'flex',
	alignItems: 'center',
	gap: 0,
	padding: theme.spacing(0, 0),
	// ...theme.mixins.toolbar,
	justifyContent: 'space-between',
}))

interface DashboardSidebarProps {
	isStatic: boolean
	onClose: () => void
	open: boolean
	handleDrawerOpen: () => void
}

export const DashboardSidebar: FC<DashboardSidebarProps> = ({
	isStatic,
	onClose,
	open,
	handleDrawerOpen,
}) => {
	const theme = useTheme()

	return (
		<>
			<DrawerToggleButton isOpen={open} isStatic={isStatic} onClick={handleDrawerOpen} />
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
				open={open}
			>
				<DrawerHeader>
					<SelectStorageMode />
					{!isStatic && (
						<IconButton size='small' onClick={onClose}>
							{theme.direction === 'ltr' ? (
								<ChevronLeftIcon size={22} />
							) : (
								<ChevronRightIcon size={22} />
							)}
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
		</>
	)
}
