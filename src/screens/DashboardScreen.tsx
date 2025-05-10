import { DashboardList } from '@modules/DashboardList'
import { DashboardViewing } from '@/modules/DashboardRightbar/DashboardViewing'

import { FC } from 'react'

import { Stack, Typography } from '@mui/material'

export const DashboardScreen: FC = () => {
	return (
		<Stack direction='row' height='100%'>
			<DashboardList />
			{/* <DashboardViewing /> */}
		</Stack>
	)
}
