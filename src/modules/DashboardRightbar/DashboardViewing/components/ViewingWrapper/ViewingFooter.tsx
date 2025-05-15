import { Actions } from '.'

import { FC } from 'react'

import { Button, Stack, Typography } from '@mui/material'

interface ViewingFooterProps {
	actions?: Actions
	mode: 'view' | 'edit'
}

export const ViewingFooter: FC<ViewingFooterProps> = ({ mode }) => {
	return (
		<Stack
			pt={0.5}
			width={'100%'}
			direction='row'
			alignItems='center'
			justifyContent='center'
			gap={1}
			component={'header'}
			sx={(theme) => ({
				borderTop: `1px solid ${theme.palette.divider}`,
			})}
		>
			<Button fullWidth size='large' variant='contained'>
				{mode === 'view' ? 'Edit' : 'Save'}
			</Button>
		</Stack>
	)
}
