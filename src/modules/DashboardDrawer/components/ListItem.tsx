import { type FC, ReactNode } from 'react'

import { ListItemButton, ListItemButtonProps, ListItemIcon, ListItemText } from '@mui/material'

interface ListItemProps extends ListItemButtonProps {
	index: number
	isEnd: boolean
	icon?: ReactNode
	title: string
	onClick?: () => void
	selected?: boolean
}

export const ListItem: FC<ListItemProps> = ({
	index,
	isEnd,
	icon,
	title,
	onClick,
	selected,
	...props
}) => {
	return (
		<ListItemButton
			sx={(_) => ({
				borderRadius: 1,
				py: 0.5,
				px: 1,
				mt: index === 0 ? 0.3 : 0,
				mb: isEnd ? 0 : 0.3,
			})}
			{...props}
			selected={selected}
			key={index}
			onClick={onClick}
		>
			{icon && <ListItemIcon>{icon}</ListItemIcon>}
			<ListItemText
				sx={{ '& .MuiTypography-root': { fontSize: 14 } }}
				primary={`${title} ${index + 1 || ''}`}
			/>
		</ListItemButton>
	)
}
