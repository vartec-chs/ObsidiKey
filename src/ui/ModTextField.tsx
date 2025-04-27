import { forwardRef, useState } from 'react'

import {
	alpha,
	IconButton,
	OutlinedInputProps,
	styled,
	TextField,
	TextFieldProps,
} from '@mui/material'
import { grey } from '@mui/material/colors'

import { EyeIcon, EyeOffIcon } from 'lucide-react'

const ModernTextField = styled((props: TextFieldProps) => (
	<TextField InputProps={{ disableUnderline: true } as Partial<OutlinedInputProps>} {...props} />
))(({ theme }) => ({
	'& .MuiFilledInput-root': {
		overflow: 'hidden',
		borderRadius: theme.spacing(1),

		border: `1px solid ${theme.palette.mode === 'light' ? alpha(grey[900], 0.1) : alpha(grey[900], 0.4)}`,
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
	({ variant = 'filled', ...props }, ref) => {
		const inputType = props.type
		const [type, setType] = useState(inputType)

		const Button = (
			<IconButton onClick={() => setType(type === 'password' ? 'text' : 'password')}>
				{type === 'password' ? <EyeIcon /> : <EyeOffIcon />}
			</IconButton>
		)

		return props.size !== 'small' ? (
			<ModernTextField
				{...props}
				type={inputType === 'password' ? type : inputType}
				size='small'
				variant='filled'
				ref={ref}
				slotProps={{
					...props.slotProps,
					input: {
						disableUnderline: true,
						...props.slotProps?.input,
					},
				}}
				InputProps={{
					disableUnderline: true,
					...props.InputProps,

					endAdornment: inputType === 'password' ? Button : null,
				}}
			/>
		) : (
			<ModernTextField
				{...props}
				type={inputType === 'password' ? type : inputType}
				sx={{ '& .MuiFilledInput-root': { height: '3.6rem' } }}
				variant='filled'
				ref={ref}
				slotProps={{
					...props.slotProps,
					input: {
						disableUnderline: true,
						...props.slotProps?.input,
					},
				}}
				InputProps={{
					disableUnderline: true,
					...props.InputProps,
					endAdornment: inputType === 'password' ? Button : null,
				}}
			/>
		)
	},
)
