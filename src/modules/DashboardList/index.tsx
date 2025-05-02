import { DashboardPaper } from '@ui/DashboardPaper'

import { FC } from 'react'

import { Fab, Pagination, Stack } from '@mui/material'

import { PlusIcon } from 'lucide-react'

import { ContentList } from './components/ContentList'
import { ListHeader } from './components/ListHeader'

export const DashboardList: FC = () => {
	console.log('Dashboard rerendered')
	return (
		<DashboardPaper
			side='left'
			sx={{
				display: 'flex',
				alignItems: 'center',
				flexDirection: 'column',
				gap: 0.5,
				width: '100%',
				position: 'relative',
			}}
		>
			<ListHeader />
			<ContentList />
			<Fab
				// onClick={handleAddNewPassword}
				color='primary'
				aria-label='add'
				sx={{ position: 'absolute', bottom: 5, right: 5, zIndex: 998 }}
			>
				<PlusIcon />
			</Fab>
			<Stack
				direction='row'
				justifyContent='start'
				alignItems='center'
				sx={{ padding: 0, width: '100%' }}
			>
				<Pagination count={5} variant='text' color='standard' sx={{ mb: 0.5 }} />
			</Stack>
		</DashboardPaper>
	)
}
