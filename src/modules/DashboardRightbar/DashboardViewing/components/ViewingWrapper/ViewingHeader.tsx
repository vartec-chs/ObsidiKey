import { Actions } from '.'

import { FC } from 'react'

import { IconButton, Stack, Typography } from '@mui/material'

import { ChevronRightIcon } from 'lucide-react'

import { useSidebar } from '@providers/SidebarProvider'

import { ViewingHeaderMenu } from './ViewingHeaderMenu'

interface ViewingHeaderProps {
	actions?: Actions
	mode: 'view' | 'edit'
}

export const ViewingHeader: FC<ViewingHeaderProps> = ({ actions, mode }) => {
	const { isStaticRightbar, toggleRightbar } = useSidebar()

	return (
		<Stack
			width={'100%'}
			height={50}
			direction='row'
			alignItems='center'
			justifyContent='space-between'
			gap={1}
			component={'header'}
			sx={(theme) => ({
				borderBottom: `1px solid ${theme.palette.divider}`,
			})}
		>
			{!isStaticRightbar && (
				<IconButton size='small' onClick={toggleRightbar}>
					<ChevronRightIcon size={22} />
				</IconButton>
			)}
			<Typography variant='h6'>{mode === 'edit' ? 'Редактирование' : 'Просмотр'}</Typography>
			<ViewingHeaderMenu />
		</Stack>
	)
}
