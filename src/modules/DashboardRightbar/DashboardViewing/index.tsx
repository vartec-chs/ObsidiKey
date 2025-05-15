import { scrollBar } from '@config/theme'
import { DashboardPaper } from '@ui/DashboardPaper'

import { FC } from 'react'

import { Box, Stack } from '@mui/material'


import { ViewingFooter } from './components/ViewingWrapper/ViewingFooter'
import { ViewingHeader } from './components/ViewingWrapper/ViewingHeader'

export const DashboardViewing: FC = () => {
	console.log('DashboardViewing Render')
	const mode: 'view' | 'edit' = 'view'
	return (
		<DashboardPaper>
			<Stack
				direction='column'
				height='100%'
				width='100%'
				justifyContent='space-between'
				alignItems='center'
				gap={0.5}
			>
				<ViewingHeader mode={mode} />
				<Box width='100%' height='100%' sx={(theme) => scrollBar(theme)}></Box>
				<ViewingFooter mode={mode} />
			</Stack>
		</DashboardPaper>
	)
}
