import React, {
	createContext,
	forwardRef,
	useCallback,
	useContext,
	useEffect,
	useState,
} from 'react'

import { Theme, useMediaQuery } from '@mui/material'
import {
	Box,
	Chip,
	Divider,
	Drawer,
	IconButton,
	List,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	Skeleton,
	TextField,
	Tooltip,
	Typography,
} from '@mui/material'
import { SxProps } from '@mui/system'

import { MenuIcon } from 'lucide-react'

// Типы для состояния и параметров боковой панели
type SidebarState = 'expanded' | 'collapsed'
type SidebarSide = 'left' | 'right'
type SidebarVariant = 'sidebar' | 'floating' | 'inset'
type SidebarCollapsible = 'offcanvas' | 'icon' | 'none'

// Интерфейс контекста
interface SidebarContextProps {
	state: SidebarState
	open: boolean
	setOpen: (open: boolean | ((prev: boolean) => boolean)) => void
	openMobile: boolean
	setOpenMobile: (open: boolean) => void
	isMobile: boolean
	toggleSidebar: () => void
	collapsible: SidebarCollapsible
}

// Создание контекста
const SidebarContext = createContext<SidebarContextProps | null>(null)

// Хук для использования контекста
function useSidebar(): SidebarContextProps {
	const context = useContext(SidebarContext)
	if (!context) {
		throw new Error('useSidebar must be used within a SidebarProvider.')
	}
	return context
}

// Пропсы для SidebarProvider
interface SidebarProviderProps extends React.HTMLAttributes<HTMLDivElement> {
	defaultOpen?: boolean
	open?: boolean
	onOpenChange?: (open: boolean) => void
	collapsible?: SidebarCollapsible
	sx?: SxProps<Theme>
}

// Компонент SidebarProvider
const SidebarProvider = forwardRef<HTMLDivElement, SidebarProviderProps>(
	(
		{
			defaultOpen = true,
			open: openProp,
			onOpenChange: setOpenProp,
			collapsible = 'offcanvas',
			children,
			sx,
			...props
		},
		ref,
	) => {
		const isMobile = useMediaQuery('(max-width: 768px)')
		const [openMobile, setOpenMobile] = useState(false)
		const [_open, _setOpen] = useState(defaultOpen)
		const open = openProp ?? _open

		const setOpen = useCallback(
			(value: boolean | ((prev: boolean) => boolean)) => {
				const openState = typeof value === 'function' ? value(open) : value
				if (setOpenProp) {
					setOpenProp(openState)
				} else {
					_setOpen(openState)
				}
			},
			[setOpenProp, open],
		)

		const toggleSidebar = useCallback(() => {
			if (isMobile) {
				setOpenMobile((prev) => !prev)
			} else {
				setOpen((prev) => !prev)
			}
		}, [isMobile, setOpen, setOpenMobile])

		useEffect(() => {
			const handleKeyDown = (event: KeyboardEvent) => {
				if (event.key === 'b' && (event.metaKey || event.ctrlKey)) {
					event.preventDefault()
					toggleSidebar()
				}
			}
			window.addEventListener('keydown', handleKeyDown)
			return () => window.removeEventListener('keydown', handleKeyDown)
		}, [toggleSidebar])

		const state: SidebarState = open ? 'expanded' : 'collapsed'

		const contextValue: SidebarContextProps = {
			state,
			open,
			setOpen,
			isMobile,
			openMobile,
			setOpenMobile,
			toggleSidebar,
			collapsible,
		}

		return (
			<SidebarContext.Provider value={contextValue}>
				<Box sx={{ display: 'flex', minHeight: '100%', ...sx }} ref={ref} {...props}>
					{children}
				</Box>
			</SidebarContext.Provider>
		)
	},
)
SidebarProvider.displayName = 'SidebarProvider'

// Пропсы для Sidebar
interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
	side?: SidebarSide
	variant?: SidebarVariant
	collapsible?: SidebarCollapsible
	sx?: SxProps<Theme>
}

// Компонент Sidebar
const Sidebar = forwardRef<HTMLDivElement, SidebarProps>(
	(
		{ side = 'left', variant = 'sidebar', collapsible = 'offcanvas', children, sx, ...props },
		ref,
	) => {
		const { isMobile, state, openMobile, setOpenMobile } = useSidebar()

		if (isMobile) {
			return (
				<Drawer
					anchor={side}
					variant='temporary'
					open={openMobile}
					onClose={() => setOpenMobile(false)}
					ModalProps={{ keepMounted: true }}
					sx={{
						position: 'relative',
						'& .MuiDrawer-paper': {
							width: '18rem',
							bgcolor: 'background.paper',
							color: 'text.primary',
							boxSizing: 'border-box',
							// ...sx,
						},
					}}
					{...props}
				>
					<Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>{children}</Box>
				</Drawer>
			)
		}

		if (collapsible === 'none') {
			return (
				<Box
					sx={{
						position: 'relative',
						width: '16rem',
						bgcolor: 'background.paper',
						color: 'text.primary',
						display: 'flex',
						flexDirection: 'column',
						height: '100%',
						...sx,
					}}
					ref={ref}
					{...props}
				>
					{children}
				</Box>
			)
		}

		let drawerWidth: string
		let transform: string | undefined
		if (collapsible === 'icon') {
			drawerWidth = state === 'expanded' ? '16rem' : '3rem'
		} else {
			drawerWidth = '16rem'
			transform =
				state === 'collapsed'
					? side === 'left'
						? 'translateX(-100%)'
						: 'translateX(100%)'
					: 'none'
		}

		const variantStyles: Record<SidebarVariant, SxProps<Theme>> = {
			floating: {
				borderRadius: '8px',
				border: '1px solid',
				borderColor: 'divider',
				boxShadow: 1,
				m: 1,
			},
			inset: { m: 1 },
			sidebar: {
				borderRight: side === 'left' ? '1px solid' : 'none',
				borderLeft: side === 'right' ? '1px solid' : 'none',
				borderColor: 'divider',
			},
		}

		return (
			<Drawer
				variant='permanent'
				anchor={side}
				sx={{
					// position: 'relative',
					'& .MuiDrawer-paper': {
						// position: state === 'expanded' ? 'relative' : 'absolute',
						height: '100%',
						width: drawerWidth,
						transform,
						transition: 'width 200ms, transform 200ms',
						bgcolor: 'background.paper',
						color: 'text.primary',
						overflowX: 'hidden',
						// ...variantStyles[variant],
						borderRight: side === 'left' ? '1px solid' : 'none',
						borderLeft: side === 'right' ? '1px solid' : 'none',
						borderColor: 'divider',
						// ...sx,
					},
				}}
				ref={ref}
				{...props}
			>
				<Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>{children}</Box>
			</Drawer>
		)
	},
)
Sidebar.displayName = 'Sidebar'

// Пропсы для SidebarTrigger
interface SidebarTriggerProps extends React.ComponentProps<typeof IconButton> {
	sx?: SxProps<Theme>
}

// Компонент SidebarTrigger
const SidebarTrigger = forwardRef<HTMLButtonElement, SidebarTriggerProps>(
	({ sx, ...props }, ref) => {
		const { toggleSidebar } = useSidebar()
		return (
			<IconButton
				onClick={toggleSidebar}
				sx={{ width: 28, height: 28, ...sx }}
				ref={ref}
				{...props}
			>
				<MenuIcon />
			</IconButton>
		)
	},
)
SidebarTrigger.displayName = 'SidebarTrigger'

// Пропсы для SidebarInset
interface SidebarInsetProps extends React.HTMLAttributes<HTMLDivElement> {
	sx?: SxProps<Theme>
}

// Компонент SidebarInset
const SidebarInset = forwardRef<HTMLDivElement, SidebarInsetProps>(
	({ children, sx, ...props }, ref) => {
		return (
			<Box
				component='main'
				sx={{
					flex: 1,
					bgcolor: 'background.default',
					position: 'relative',
					display: 'flex',
					flexDirection: 'column',
					...sx,
				}}
				ref={ref}
				{...props}
			>
				{children}
			</Box>
		)
	},
)
SidebarInset.displayName = 'SidebarInset'

// Пропсы для SidebarInput
interface SidebarInputProps extends React.ComponentProps<typeof TextField> {
	sx?: SxProps<Theme>
}

// Компонент SidebarInput
const SidebarInput = forwardRef<HTMLInputElement, SidebarInputProps>(({ sx, ...props }, ref) => (
	<TextField
		variant='outlined'
		size='small'
		fullWidth
		sx={{ m: 1, ...sx }}
		inputRef={ref}
		{...props}
	/>
))
SidebarInput.displayName = 'SidebarInput'

// Пропсы для SidebarHeader
interface SidebarHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
	sx?: SxProps<Theme>
}

// Компонент SidebarHeader
const SidebarHeader = forwardRef<HTMLDivElement, SidebarHeaderProps>(
	({ children, sx, ...props }, ref) => (
		<Box
			sx={{ p: 1, display: 'flex', flexDirection: 'column', gap: 1, ...sx }}
			ref={ref}
			{...props}
		>
			{children}
		</Box>
	),
)
SidebarHeader.displayName = 'SidebarHeader'

// Пропсы для SidebarFooter
interface SidebarFooterProps extends React.HTMLAttributes<HTMLDivElement> {
	sx?: SxProps<Theme>
}

// Компонент SidebarFooter
const SidebarFooter = forwardRef<HTMLDivElement, SidebarFooterProps>(
	({ children, sx, ...props }, ref) => (
		<Box
			sx={{ p: 1, display: 'flex', flexDirection: 'column', gap: 1, ...sx }}
			ref={ref}
			{...props}
		>
			{children}
		</Box>
	),
)
SidebarFooter.displayName = 'SidebarFooter'

// Пропсы для SidebarSeparator
interface SidebarSeparatorProps extends React.ComponentProps<typeof Divider> {
	sx?: SxProps<Theme>
}

// Компонент SidebarSeparator
// const SidebarSeparator = forwardRef<HTMLDivElement, SidebarSeparatorProps>(
//   ({ sx, ...props }, ref) => (
//     <Divider sx={{ mx: 1, ...sx }} ref={ref} {...props} />
//   )
// );
// SidebarSeparator.displayName = 'SidebarSeparator';

// Пропсы для SidebarContent
interface SidebarContentProps extends React.HTMLAttributes<HTMLDivElement> {
	sx?: SxProps<Theme>
}

// Компонент SidebarContent
const SidebarContent = forwardRef<HTMLDivElement, SidebarContentProps>(
	({ children, sx, ...props }, ref) => (
		<Box
			sx={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column', gap: 1, ...sx }}
			ref={ref}
			{...props}
		>
			{children}
		</Box>
	),
)
SidebarContent.displayName = 'SidebarContent'

// Пропсы для SidebarGroup
interface SidebarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
	sx?: SxProps<Theme>
}

// Компонент SidebarGroup
const SidebarGroup = forwardRef<HTMLDivElement, SidebarGroupProps>(
	({ children, sx, ...props }, ref) => (
		<Box sx={{ p: 1, display: 'flex', flexDirection: 'column', ...sx }} ref={ref} {...props}>
			{children}
		</Box>
	),
)
SidebarGroup.displayName = 'SidebarGroup'

// Пропсы для SidebarGroupLabel
interface SidebarGroupLabelProps extends React.HTMLAttributes<HTMLDivElement> {
	sx?: SxProps<Theme>
}

// Компонент SidebarGroupLabel
const SidebarGroupLabel = forwardRef<HTMLDivElement, SidebarGroupLabelProps>(
	({ children, sx, ...props }, ref) => {
		const { state, collapsible } = useSidebar()
		if (collapsible === 'icon' && state === 'collapsed') return null
		return (
			<Typography
				variant='caption'
				sx={{ px: 1, fontWeight: 'medium', ...sx }}
				ref={ref}
				{...props}
			>
				{children}
			</Typography>
		)
	},
)
SidebarGroupLabel.displayName = 'SidebarGroupLabel'

// Пропсы для SidebarGroupAction
interface SidebarGroupActionProps extends React.ComponentProps<typeof IconButton> {
	sx?: SxProps<Theme>
}

// Компонент SidebarGroupAction
const SidebarGroupAction = forwardRef<HTMLButtonElement, SidebarGroupActionProps>(
	({ children, sx, ...props }, ref) => {
		const { state, collapsible } = useSidebar()
		if (collapsible === 'icon' && state === 'collapsed') return null
		return (
			<IconButton
				size='small'
				sx={{ position: 'absolute', top: 14, right: 12, ...sx }}
				ref={ref}
				{...props}
			>
				{children}
			</IconButton>
		)
	},
)
SidebarGroupAction.displayName = 'SidebarGroupAction'

// Пропсы для SidebarGroupContent
interface SidebarGroupContentProps extends React.HTMLAttributes<HTMLDivElement> {
	sx?: SxProps<Theme>
}

// Компонент SidebarGroupContent
const SidebarGroupContent = forwardRef<HTMLDivElement, SidebarGroupContentProps>(
	({ children, sx, ...props }, ref) => (
		<Box sx={{ display: 'flex', flexDirection: 'column', ...sx }} ref={ref} {...props}>
			{children}
		</Box>
	),
)
SidebarGroupContent.displayName = 'SidebarGroupContent'

// Пропсы для SidebarMenu
interface SidebarMenuProps extends React.HTMLAttributes<HTMLUListElement> {
	sx?: SxProps<Theme>
}

// Компонент SidebarMenu
const SidebarMenu = forwardRef<HTMLUListElement, SidebarMenuProps>(
	({ children, sx, ...props }, ref) => (
		<List
			sx={{ p: 0, display: 'flex', flexDirection: 'column', gap: 0.5, ...sx }}
			ref={ref}
			{...props}
		>
			{children}
		</List>
	),
)
SidebarMenu.displayName = 'SidebarMenu'

// Пропсы для SidebarMenuItem
interface SidebarMenuItemProps extends React.HTMLAttributes<HTMLLIElement> {
	sx?: SxProps<Theme>
}

// Компонент SidebarMenuItem
const SidebarMenuItem = forwardRef<HTMLLIElement, SidebarMenuItemProps>(
	({ children, sx, ...props }, ref) => (
		<ListItem sx={{ p: 0, position: 'relative', ...sx }} ref={ref} {...props}>
			{children}
		</ListItem>
	),
)
SidebarMenuItem.displayName = 'SidebarMenuItem'

// Пропсы для SidebarMenuButton
interface SidebarMenuButtonProps extends React.ComponentProps<typeof ListItemButton> {
	icon?: React.ReactNode
	isActive?: boolean
	tooltip?: string
	sx?: SxProps<Theme>
}

// Компонент SidebarMenuButton
const SidebarMenuButton = forwardRef<HTMLDivElement, SidebarMenuButtonProps>(
	({ icon, children, isActive = false, tooltip, sx, ...props }, ref) => {
		const { state, collapsible, isMobile } = useSidebar()
		const isIconOnly = !isMobile && collapsible === 'icon' && state === 'collapsed'

		const button = (
			<ListItemButton
				selected={isActive}
				sx={{
					borderRadius: '4px',
					m: '2px 8px',
					minHeight: isIconOnly ? 32 : 40,
					justifyContent: isIconOnly ? 'center' : 'initial',
					'& .MuiListItemIcon-root': { minWidth: 0, mr: isIconOnly ? 0 : 1 },
					'& .MuiListItemText-root': { display: isIconOnly ? 'none' : 'block' },
					// ...sx,
				}}
				ref={ref}
				{...props}
			>
				{icon && <ListItemIcon>{icon}</ListItemIcon>}
				<ListItemText primary={children} />
			</ListItemButton>
		)

		if (isIconOnly && tooltip) {
			return (
				<Tooltip title={tooltip} placement='right'>
					{button}
				</Tooltip>
			)
		}
		return button
	},
)
SidebarMenuButton.displayName = 'SidebarMenuButton'

// Пропсы для SidebarMenuAction
interface SidebarMenuActionProps extends React.ComponentProps<typeof IconButton> {
	sx?: SxProps<Theme>
}

// Компонент SidebarMenuAction
const SidebarMenuAction = forwardRef<HTMLButtonElement, SidebarMenuActionProps>(
	({ children, sx, ...props }, ref) => {
		const { state, collapsible } = useSidebar()
		if (collapsible === 'icon' && state === 'collapsed') return null
		return (
			<IconButton
				size='small'
				sx={{ position: 'absolute', right: 4, top: 6, ...sx }}
				ref={ref}
				{...props}
			>
				{children}
			</IconButton>
		)
	},
)
SidebarMenuAction.displayName = 'SidebarMenuAction'

// Пропсы для SidebarMenuBadge
interface SidebarMenuBadgeProps extends React.ComponentProps<typeof Chip> {
	sx?: SxProps<Theme>
}

// Компонент SidebarMenuBadge
const SidebarMenuBadge = forwardRef<HTMLDivElement, SidebarMenuBadgeProps>(
	({ children, sx, ...props }, ref) => {
		const { state, collapsible } = useSidebar()
		if (collapsible === 'icon' && state === 'collapsed') return null
		return (
			<Chip
				label={children}
				size='small'
				sx={{ position: 'absolute', right: 4, top: 10, ...sx }}
				ref={ref}
				{...props}
			/>
		)
	},
)
SidebarMenuBadge.displayName = 'SidebarMenuBadge'

// Пропсы для SidebarMenuSkeleton
interface SidebarMenuSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
	showIcon?: boolean
	sx?: SxProps<Theme>
}

// Компонент SidebarMenuSkeleton
const SidebarMenuSkeleton = forwardRef<HTMLDivElement, SidebarMenuSkeletonProps>(
	({ showIcon = false, sx, ...props }, ref) => {
		const width = `${Math.floor(Math.random() * 40) + 50}%`
		return (
			<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1, ...sx }} ref={ref} {...props}>
				{showIcon && <Skeleton variant='circular' width={16} height={16} />}
				<Skeleton variant='text' sx={{ width }} />
			</Box>
		)
	},
)
SidebarMenuSkeleton.displayName = 'SidebarMenuSkeleton'

// Пропсы для SidebarMenuSub
interface SidebarMenuSubProps extends React.HTMLAttributes<HTMLUListElement> {
	sx?: SxProps<Theme>
}

// Компонент SidebarMenuSub
const SidebarMenuSub = forwardRef<HTMLUListElement, SidebarMenuSubProps>(
	({ children, sx, ...props }, ref) => {
		const { state, collapsible } = useSidebar()
		if (collapsible === 'icon' && state === 'collapsed') return null
		return (
			<List sx={{ pl: 2, ...sx }} ref={ref} {...props}>
				{children}
			</List>
		)
	},
)
SidebarMenuSub.displayName = 'SidebarMenuSub'

// Пропсы для SidebarMenuSubItem
interface SidebarMenuSubItemProps extends React.HTMLAttributes<HTMLLIElement> {
	sx?: SxProps<Theme>
}

// Компонент SidebarMenuSubItem
const SidebarMenuSubItem = forwardRef<HTMLLIElement, SidebarMenuSubItemProps>(
	({ sx, ...props }, ref) => <ListItem sx={{ ...sx }} ref={ref} {...props} />,
)
SidebarMenuSubItem.displayName = 'SidebarMenuSubItem'

// Пропсы для SidebarMenuSubButton
interface SidebarMenuSubButtonProps extends React.ComponentProps<typeof ListItemButton> {
	size?: 'sm' | 'md'
	isActive?: boolean
	sx?: SxProps<Theme>
}

// Компонент SidebarMenuSubButton
const SidebarMenuSubButton = forwardRef<HTMLDivElement, SidebarMenuSubButtonProps>(
	({ size = 'md', isActive = false, children, sx, ...props }, ref) => {
		const { state, collapsible } = useSidebar()
		if (collapsible === 'icon' && state === 'collapsed') return null
		return (
			<ListItemButton
				selected={isActive}
				sx={{ height: size === 'sm' ? 28 : 36, ...sx }}
				ref={ref}
				{...props}
			>
				<ListItemText
					primary={children}
					primaryTypographyProps={{ variant: size === 'sm' ? 'caption' : 'body2' }}
				/>
			</ListItemButton>
		)
	},
)
SidebarMenuSubButton.displayName = 'SidebarMenuSubButton'

export {
	SidebarProvider,
	useSidebar,
	Sidebar,
	SidebarTrigger,
	SidebarInset,
	SidebarInput,
	SidebarHeader,
	SidebarFooter,
	// SidebarSeparator,
	SidebarContent,
	SidebarGroup,
	SidebarGroupLabel,
	SidebarGroupAction,
	SidebarGroupContent,
	SidebarMenu,
	SidebarMenuItem,
	SidebarMenuButton,
	SidebarMenuAction,
	SidebarMenuBadge,
	SidebarMenuSkeleton,
	SidebarMenuSub,
	SidebarMenuSubItem,
	SidebarMenuSubButton,
}
