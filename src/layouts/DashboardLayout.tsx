// import { Sidebar, SidebarProvider } from '@ui/Sidebar'
// import type { FC } from 'react'
// import { Outlet } from 'react-router'
// import { Stack } from '@mui/material'
// export const DashboardLayout: FC = () => {
// 	return (
// 		<SidebarProvider>
// 			<Stack
// 				component='main'
// 				width='100%'
// 				height='100%'
// 				gap={0}
// 				m={0}
// 				p={0}
// 				alignItems='center'
// 				direction='row'
// 				justifyContent='space-between'
// 			>
// 				<Sidebar></Sidebar>
// 				<Outlet />
// 			</Stack>
// 		</SidebarProvider>
// 	)
// }
// import {
// 	Sidebar,
// 	SidebarContent,
// 	SidebarGroup,
// 	SidebarGroupLabel,
// 	SidebarHeader,
// 	SidebarInset,
// 	SidebarMenu,
// 	SidebarMenuBadge,
// 	SidebarMenuButton,
// 	SidebarMenuItem,
// 	SidebarProvider,
// 	SidebarTrigger,
// } from '@ui/Sidebar'
// import { FC } from 'react'
// import { Outlet } from 'react-router'
// export const DashboardLayout: FC = () => {
// 	return (
// 		<SidebarProvider defaultOpen={true} collapsible='icon'>
// 			<Sidebar side='left' variant='sidebar'>
// 				<SidebarHeader>
// 					<SidebarTrigger />
// 				</SidebarHeader>
// 				<SidebarContent>
// 					<SidebarGroup>
// 						<SidebarGroupLabel>Navigation</SidebarGroupLabel>
// 						<SidebarMenu>
// 							<SidebarMenuItem>
// 								<SidebarMenuButton isActive={true} tooltip='Home'>
// 									Home
// 								</SidebarMenuButton>
// 								{/* <SidebarMenuBadge>5</SidebarMenuBadge> */}
// 							</SidebarMenuItem>
// 							<SidebarMenuItem>
// 								<SidebarMenuButton tooltip='Settings'>Settings</SidebarMenuButton>
// 							</SidebarMenuItem>
// 							<SidebarMenuItem>
// 								<SidebarMenuButton tooltip='Notifications'>Notifications</SidebarMenuButton>
// 								{/* <SidebarMenuBadge>3</SidebarMenuBadge> */}
// 							</SidebarMenuItem>
// 						</SidebarMenu>
// 					</SidebarGroup>
// 				</SidebarContent>
// 			</Sidebar>
// 			<SidebarInset>
// 				<Outlet />
// 			</SidebarInset>
// 		</SidebarProvider>
// 	)
// }
import { AppBarHeight, BottomBarHeight } from '@/config/elements-size'

import { FC, useState } from 'react'
import { Outlet } from 'react-router'

import {
	Box,
	Divider,
	Drawer,
	IconButton,
	List,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	AppBar as MuiAppBar,
	AppBarProps as MuiAppBarProps,
	styled,
	Toolbar,
	Typography,
	useTheme,
} from '@mui/material'

import { ChevronLeftIcon, ChevronRightIcon, InboxIcon, MailIcon, MenuIcon } from 'lucide-react'

import { AnimatePresence, motion } from 'motion/react'

const drawerWidth = 250

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
	open?: boolean
}>(({ theme }) => ({
	flexGrow: 1,
	height: '100%',
	padding: theme.spacing(),
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
	padding: theme.spacing(0, 1),
	// necessary for content to be below app bar
	...theme.mixins.toolbar,
	justifyContent: 'flex-end',
}))

export const DashboardLayout: FC = () => {
	const theme = useTheme()

	const isStatic = true

	const [open, setOpen] = useState(false)
	const handleDrawerOpen = () => {
		setOpen(true)
	}

	const handleDrawerClose = () => {
		// if (isStatic) return
		setOpen(false)
	}

	return (
		<Box sx={{ display: 'flex', position: 'relative', height: '100%' }}>
			<AnimatePresence>
				{!open && !isStatic && (
					<motion.div
						initial={{ opacity: 0, scale: 0.8, y: -5 }}
						animate={{ opacity: 1, scale: 1, y: 0 }}
						exit={{ opacity: 0, scale: 0.8, y: -5 }}
						transition={{ duration: 0.3 }}
						style={{ position: 'absolute', top: 5, left: 15, zIndex: 1000 }}
					>
						<IconButton
							color='inherit'
							aria-label='open drawer'
							onClick={handleDrawerOpen}
							edge='start'
							// sx={[open && { display: 'none' }]}
						>
							<MenuIcon />
						</IconButton>
					</motion.div>
				)}
			</AnimatePresence>
			<Drawer
				sx={{
					position: 'relative',
					width: drawerWidth,
					flexShrink: 0,
					'& .MuiDrawer-paper': {
						position: 'relative',
						width: drawerWidth,
						boxSizing: 'border-box',
					},
				}}
				variant={isStatic ? 'permanent' : 'persistent'}
				anchor='left'
				open={open}
			>
				<DrawerHeader>
					{!isStatic && (
						<IconButton onClick={handleDrawerClose}>
							{theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
						</IconButton>
					)}
				</DrawerHeader>
				<Divider />
				<List>
					{['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
						<ListItem key={text} disablePadding>
							<ListItemButton>
								<ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
								<ListItemText primary={text} />
							</ListItemButton>
						</ListItem>
					))}
				</List>
				<Divider />
				<List>
					{['All mail', 'Trash', 'Spam'].map((text, index) => (
						<ListItem key={text} disablePadding>
							<ListItemButton>
								<ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
								<ListItemText primary={text} />
							</ListItemButton>
						</ListItem>
					))}
				</List>
			</Drawer>
			<Main open={open || isStatic}>
				{/* <DrawerHeader /> */}
				<Outlet />
			</Main>
		</Box>
	)
}
