import { DashboardPaper } from '@ui/DashboardPaper'

import { FC } from 'react'

import { Typography } from '@mui/material'

import { ViewingWrapper } from './components/ViewingWrapper'

export const DashboardViewing: FC = () => {
	console.log('DashboardViewing Render')
	return (
		<DashboardPaper>
			<ViewingWrapper>
				{new Array(30).fill(0).map((_, index) => (
					<Typography key={index}>Item {index}</Typography>
				))}
			</ViewingWrapper>
		</DashboardPaper>
	)
}
