import { type FC } from 'react'

import { useTheme } from '@mui/material'
import { colors } from '@mui/material'

interface Props {
	width?: number
	height?: number
}

export const Logo: FC<Props> = ({ width = 48, height = 48 }) => {
	const theme = useTheme()

	const mode = theme.palette.mode
	const color = mode === 'dark' ? colors.grey[200] : colors.grey[900]

	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			viewBox='0 0 50 50'
			width={width}
			height={height}
			fill={color}
		>
			<path d='M36.22 10.87L29.82 6.93 30.67 4.26zM16.88 16.68L17.93 42.37 17.91 42.33 9.62 22.88 15 11 16.22 14.66zM27.76 6.8L18.37 14.77 16.75 9.75 28.97 3.02zM19.09 21.86L29.43 45.86 19.95 42.95zM38.08 14.37L33.25 42.75 31.44 45.47 19.09 16.78 28.72 8.61z' />
		</svg>
	)
}
