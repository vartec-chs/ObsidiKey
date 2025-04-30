import { FC } from 'react'

import {
	Divider,
	IconButton,
	List,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	styled,
	useTheme,
} from '@mui/material'

import { ChevronLeftIcon, ChevronRightIcon, InboxIcon, MailIcon } from 'lucide-react'

import { drawerWidth } from '@layouts/DashboardLayout'

import { CategoryList } from './components/CategoryList'
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
	padding: theme.spacing(0, 1),
	// ...theme.mixins.toolbar,
	justifyContent: 'flex-end',

}))

interface DrawerContentProps {
	isStatic: boolean
	onClose: () => void
}

export const DrawerContent: FC<DrawerContentProps> = ({ isStatic, onClose }) => {
	const theme = useTheme()

	return (
		<>
			<DrawerHeader>
				{!isStatic && (
					<IconButton onClick={onClose}>
						{theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
					</IconButton>
				)}
			</DrawerHeader>
			{/* <Divider
				variant='middle'
				sx={(theme) => ({
					border: `0.5px solid ${theme.palette.divider}`,
				})}
			/> */}
			<CategoryList />
			{/* <Divider
				variant='middle'
				sx={(theme) => ({
					border: `0.5px solid ${theme.palette.divider}`,
				})}
			/>*/}
			<TagsList />
		</>
	)
}
