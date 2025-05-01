import { bottomBarZindex } from '@/config/theme'
import { BottomBarHeight } from '@config/elements-size'

import { FC } from 'react'

import { colors, Stack } from '@mui/material'

export const BottomBar: FC = () => {
	return (
		<Stack
			component='footer'
			padding={1}
			position={'static'}
			width='100%'
			sx={(theme) => ({
				borderRadius: 0,
				zIndex: bottomBarZindex,
				px: 0.5,
				py: 0.5,
				width: '100%',
				height: `${BottomBarHeight}px`,
				boxSizing: 'border-box',
				backgroundColor: theme.palette.mode === 'dark' ? colors.grey[900] : colors.grey[100],
				borderTop: `1px solid ${theme.palette.mode === 'dark' ? colors.grey[800] : colors.grey[200]}`,
			})}
		>
			{/* <Typography variant='body1'>Bottom Bar</Typography> */}
		</Stack>
	)
}
