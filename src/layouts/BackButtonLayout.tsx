import { MotionMuiBox } from '@/ui/MotionMuiBox'
import { PATHS } from '@config/paths'

import { type FC } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router'

import { IconButton, Stack, Tooltip } from '@mui/material'

import { ArrowLeft } from 'lucide-react'

import { AnimatePresence } from 'motion/react'

export const BackButtonLayout: FC = () => {
	const { pathname } = useLocation()
	const navigate = useNavigate()

	const isNotBackButton = pathname === `${PATHS.HOME}` || pathname === `${PATHS.FIRST_OPEN}`

	return (
		<Stack
			component='section'
			sx={(theme) => ({
				display: 'flex',
				flexDirection: 'column',
				justifyItems: 'center',
				alignItems: 'center',
				position: 'relative',
				height: '100%',
				width: '100%',
				borderRadius: theme.spacing(1),
				backgroundColor:
					theme.palette.mode === 'dark'
						? theme.palette.background.paper
						: theme.palette.background.default,
			})}
		>
			<AnimatePresence>
				{!isNotBackButton && (
					<MotionMuiBox
						initial={{ opacity: 0, x: -100 }}
						animate={{ opacity: 1, x: 0 }}
						exit={{ opacity: 0, x: -100 }}
						transition={{ duration: 0.8, ease: 'easeInOut', type: 'spring' }}
						style={{
							position: 'absolute',
							top: 6,
							left: 6,
							zIndex: 1000,
						}}
					>
						<Tooltip title='Назад'>
							<IconButton onClick={() => navigate(-1)}>
								<ArrowLeft />
							</IconButton>
						</Tooltip>
					</MotionMuiBox>
				)}
			</AnimatePresence>
			<Outlet />
		</Stack>
	)
}
