import { AppBarHeight } from '@/config/elements-size'

import type { FC } from 'react'
import { ToastContainer } from 'react-toastify'

import { useTheme } from '@mui/material'

export const ToastProvider: FC = () => {
	const theme = useTheme()

	return (
		<ToastContainer
			position='top-right'
			style={{
				top: `${AppBarHeight + 10}px`,
				right: '10px',
			}}
			autoClose={5000}
			hideProgressBar={false}
			newestOnTop={false}
			closeOnClick
			rtl={false}
			limit={3}
			pauseOnFocusLoss
			draggable
			pauseOnHover
			theme={theme.palette.mode === 'dark' ? 'dark' : 'light'}
		/>
	)
}
