// import { FC, PropsWithChildren } from 'react'
// import { Box, colors, Paper, PaperProps, styled } from '@mui/material'
// const FormPaper = styled((props: PaperProps) => <Paper elevation={0} {...props} />)(
// 	({ theme }) => ({
// 		// width: '100%',
// 		// height: '100%',
// 		gap: theme.spacing(1),
// 		borderRadius: theme.shape.borderRadius,
// 		backgroundColor: theme.palette.mode === 'dark' ? colors.grey[900] : colors.grey[100],
// 		border: `1px solid ${theme.palette.mode === 'dark' ? colors.grey[800] : colors.grey[200]}`,
// 		// backgroundColor:
// 		// 	theme.palette.mode === 'dark'
// 		// 		? theme.palette.background.paper
// 		// 		: theme.palette.background.default,
// 		padding: theme.spacing(1),
// 	}),
// )
// interface FormBoxProps extends PropsWithChildren {
// 	width?: number | string
// 	height?: number | string
// 	direction?: 'row' | 'column'
// 	gap?: number
// 	alignItems?:
// 		| 'center'
// 		| 'flex-start'
// 		| 'flex-end'
// 		| 'space-between'
// 		| 'space-around'
// 		| 'space-evenly'
// 	justifyContent?:
// 		| 'center'
// 		| 'flex-start'
// 		| 'flex-end'
// 		| 'space-between'
// 		| 'space-around'
// 		| 'space-evenly'
// }
// export const FormBox: FC<FormBoxProps> = ({
// 	children,
// 	width = '100%',
// 	height = '100%',
// 	direction = 'column',
// 	gap = 1,
// 	alignItems = 'center',
// 	justifyContent,
// }) => {
// 	return (
// 		<Box display='flex' justifyContent='center' alignItems='center' width='100%' height='100%'>
// 			<FormPaper
// 				style={{
// 					width,
// 					height,
// 					boxSizing: 'border-box',
// 					alignItems,
// 					justifyContent,
// 					display: 'flex',
// 					flexDirection: direction,
// 					gap,
// 				}}
// 			>
// 				{children}
// 			</FormPaper>
// 		</Box>
// 	)
// }
import { motion } from 'framer-motion'

import { FC, forwardRef, PropsWithChildren } from 'react'

import { Box, colors, Paper, PaperProps, styled } from '@mui/material'

const FormPaper = styled((props: PaperProps) => <Paper elevation={0} {...props} />)(
	({ theme }) => ({
		gap: theme.spacing(1),
		borderRadius: theme.shape.borderRadius,
		backgroundColor: theme.palette.mode === 'dark' ? colors.grey[900] : colors.grey[100],
		border: `1px solid ${theme.palette.mode === 'dark' ? colors.grey[800] : colors.grey[200]}`,
		padding: theme.spacing(2),
	}),
)

const BoxComponent = forwardRef<HTMLDivElement, Omit<PaperProps, 'onDrag'>>((props, ref) => (
	<FormPaper {...props} ref={ref as React.Ref<HTMLDivElement>} />
))

export const MotionFormBox = motion(BoxComponent)

interface FormBoxProps extends PropsWithChildren {
	width?: number | string
	height?: number | string
	direction?: 'row' | 'column'
	gap?: number
	alignItems?:
		| 'center'
		| 'flex-start'
		| 'flex-end'
		| 'space-between'
		| 'space-around'
		| 'space-evenly'
	justifyContent?:
		| 'center'
		| 'flex-start'
		| 'flex-end'
		| 'space-between'
		| 'space-around'
		| 'space-evenly'
	headerContent?: React.ReactNode
	footerContent?: React.ReactNode
	formComponent?: React.ElementType<any, keyof React.JSX.IntrinsicElements>
	formProps?: React.ComponentPropsWithRef<any>
}

const variants = {
	initial: () => ({
		x: 300,
		opacity: 0,
		filter: 'blur(4px)',
	}),
	active: {
		x: 0,
		opacity: 1,
		filter: 'blur(0px)',
	},
	exit: () => ({
		x: -300,
		opacity: 0,
		filter: 'blur(4px)',
	}),
}

export const FormBox: FC<FormBoxProps> = ({
	children,
	width = '400px',
	height = 'fit-content',
	direction = 'column',
	gap = 1,
	alignItems = 'center',
	justifyContent,
	headerContent,
	footerContent,
	formComponent = 'div',
	formProps,
}) => {
	return (
		<Box
			width='100%'
			height='100%'
			display='flex'
			gap={2}
			flexDirection='column'
			justifyContent='center'
			alignItems='center'
			overflow='hidden'
		>
			{headerContent}

			{/* <MotionMuiBox
				initial={{ height: 0 }}
				animate={{ height: 'fit-content' }}
				transition={{ duration: 0.3, ease: 'easeOut' }}
				style={{ width: '100%', overflow: 'hidden' }}
				display='flex'
				justifyContent='center'
				alignItems='center'
			> */}
			<MotionFormBox
				{...formProps}
				component={formComponent}
				style={{
					width,
					height,
					boxSizing: 'border-box',
					alignItems,
					justifyContent,
					display: 'flex',
					flexDirection: direction,
					gap,
				}}
			>
				{children}
			</MotionFormBox>
			{footerContent}
			{/* </MotionMuiBox> */}
		</Box>
	)
}
