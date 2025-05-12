import { Actions } from '.'

import * as React from 'react'

import { Box, IconButton } from '@mui/material'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'

import { EllipsisVerticalIcon } from 'lucide-react'

export const ViewingHeaderMenu: React.FC<{ actions?: Actions }> = ({ actions }) => {
	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
	const open = Boolean(anchorEl)
	const handleClick = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget)
	}
	const handleClose = () => {
		setAnchorEl(null)
	}

	return (
		<Box>
			<IconButton
				size='small'
				id='demo-positioned-button'
				aria-controls={open ? 'demo-positioned-menu' : undefined}
				aria-haspopup='true'
				aria-expanded={open ? 'true' : undefined}
				onClick={handleClick}
			>
				<EllipsisVerticalIcon size={22} />
			</IconButton>
			<Menu
				id='demo-positioned-menu'
				aria-labelledby='demo-positioned-button'
				anchorEl={anchorEl}
				open={open}
				onClose={handleClose}
				anchorOrigin={{
					vertical: 'top',
					horizontal: 'left',
				}}
				transformOrigin={{
					vertical: 'top',
					horizontal: 'left',
				}}
			>
				<MenuItem onClick={handleClose}>Удалить</MenuItem>
			</Menu>
		</Box>
	)
}
