import { Paper, PaperProps, styled } from '@mui/material'

interface Props extends PaperProps {
	side?: 'left' | 'right' | undefined
}

export const DashboardPaper = styled((props: Props) => <Paper elevation={0} {...props} />)(
	({ theme, side }) => ({
		width: '100%',
		height: '100%',
		borderRadius: theme.spacing(0),
		// border: theme.palette.mode === 'dark' ? '1px solid #222' : '1px solid #eee',
		// borderRight: `1px solid ${theme.palette.divider}`,
		backgroundColor:
			theme.palette.mode === 'dark'
				? theme.palette.background.default
				: theme.palette.background.paper,
		[side === 'left' ? 'borderRight' : side === 'right' ? 'borderLeft' : '']:
			`2px solid ${theme.palette.divider}`,
	}),
)
