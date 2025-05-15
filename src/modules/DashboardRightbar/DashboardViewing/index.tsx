import { DashboardPaper } from '@ui/DashboardPaper'

import { FC } from 'react'

import { Typography } from '@mui/material'

import { ViewingWrapper } from './components/ViewingWrapper'

export const DashboardViewing: FC = () => {
	console.log('DashboardViewing Render')
	const mode: 'view' | 'edit' = 'view'
	return (
		<DashboardPaper>
			<ViewingWrapper mode={mode} >
				{new Array(30).fill(0).map((_, index) => (
					<Typography key={index}>Item {index}</Typography>
				))}
			</ViewingWrapper>
		</DashboardPaper>
	)
}
