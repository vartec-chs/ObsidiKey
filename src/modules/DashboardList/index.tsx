import { DashboardPaper } from '@ui/DashboardPaper'

import { FC } from 'react'

import { Typography } from '@mui/material'

export const DashboardList: FC = () => {
	return (
		<DashboardPaper side='left'>
			<Typography>Dashboard List</Typography>
		</DashboardPaper>
	)
}
