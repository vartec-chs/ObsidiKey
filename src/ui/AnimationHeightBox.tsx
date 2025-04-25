import { FC, PropsWithChildren } from 'react'

import { Box } from '@mui/material'

import { MotionMuiBox } from './MotionMuiBox'

const AnimatedBox: FC<PropsWithChildren> = ({ children }) => {
	return (
		<MotionMuiBox
			initial={{ height: 0, opacity: 0 }}
			animate={{ height: 'auto', opacity: 1 }}
			transition={{ duration: 0.5, ease: 'easeOut' }}
		>
			<Box sx={{ backgroundColor: 'primary.main', padding: 2, color: 'white' }}>{children}</Box>
		</MotionMuiBox>
	)
}

export default AnimatedBox
