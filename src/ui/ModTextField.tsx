import { forwardRef } from 'react'

import { alpha, OutlinedInputProps, styled, TextField, TextFieldProps } from '@mui/material'
import { grey } from '@mui/material/colors'

const ModernTextField = styled((props: TextFieldProps) => (
	<TextField InputProps={{ disableUnderline: true } as Partial<OutlinedInputProps>} {...props} />
))(({ theme }) => ({
	'& .MuiFilledInput-root': {
		overflow: 'hidden',
		borderRadius: theme.spacing(1),

		// height: '3.6rem',

		// backgroundColor: 'transparent',
		// backgroundColor: theme.palette.mode === 'light' ? alpha(grey[900], 0.1) : alpha(grey[900], 0.4),
		border: `1px solid ${theme.palette.mode === 'light' ? alpha(grey[900], 0.1) : alpha(grey[900], 0.4)}`,
		// borderColor: theme.palette.mode === 'light' ? '#E0E3E7' : '#2D3843',
		transition: theme.transitions.create(['border-color', 'background-color', 'box-shadow']),

		'&:-webkit-autofill': {
			WebkitBoxShadow: '0 0 0 30px white inset !important',
		},
		'&:-webkit-autofill:hover': {
			WebkitBoxShadow: '0 0 0 30px white inset !important',
		},

		'&:-webkit-autofill:focus': {
			WebkitBoxShadow: '0 0 0 30px white inset !important',
		},
		'&:-webkit-autofill:active': {
			WebkitBoxShadow: '0 0 0 30px white inset !important',
		},

		'&:hover': {
			textTrasform: 'uppercase',
		},
		'&.Mui-focused': {
			textTrasform: 'uppercase',
			backgroundColor: 'transparent',
			borderColor: theme.palette.primary.main,
		},
	},

	'& .MuiInputBase-root': {
		'&:-webkit-autofill': {
			WebkitBoxShadow: '0 0 0 30px white inset !important',
		},
		'&:-webkit-autofill:hover': {
			WebkitBoxShadow: '0 0 0 30px white inset !important',
		},

		'&:-webkit-autofill:focus': {
			WebkitBoxShadow: '0 0 0 30px white inset !important',
		},
		'&:-webkit-autofill:active': {
			WebkitBoxShadow: '0 0 0 30px white inset !important',
		},
	},
}))

export const ModTextField = forwardRef<HTMLInputElement, TextFieldProps>(
	({ variant = 'filled', ...props }, ref) =>
		props.size !== 'small' ? (
			<ModernTextField
				{...props}
				size='small'
				variant='filled'
				ref={ref}
				InputProps={{ disableUnderline: true, ...props.InputProps }}
			/>
		) : (
			<ModernTextField
				{...props}
				sx={{ '& .MuiFilledInput-root': { height: '3.6rem' } }}
				variant='filled'
				ref={ref}
				InputProps={{ disableUnderline: true, ...props.InputProps }}
			/>
		),
)
