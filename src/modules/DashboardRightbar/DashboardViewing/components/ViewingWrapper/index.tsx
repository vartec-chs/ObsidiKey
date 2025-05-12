import { scrollBar } from '@config/theme'

import { FC, ReactNode } from 'react'

import { Box, Stack } from '@mui/material'

import { ViewingFooter } from './ViewingFooter'
import { ViewingHeader } from './ViewingHeader'

export type Actions = {
	onDelete: () => void
}

interface ViewingWrapperProps {
	children: ReactNode
	actions?: Actions
}

export const ViewingWrapper: FC<ViewingWrapperProps> = ({ children }) => {
	return (
		<Stack
			direction='column'
			height='100%'
			width='100%'
			justifyContent='space-between'
			alignItems='center'
			gap={0.5}
		>
			<ViewingHeader />
			<Box width='100%' height='100%' sx={(theme) => scrollBar(theme)}>
				{children}
			</Box>
			<ViewingFooter />
		</Stack>
	)
}
