import { FormBox } from '@ui/FormBox'
import { ModTextField } from '@ui/ModTextField'

import type { FC } from 'react'

import { Button, Typography } from '@mui/material'

export const StorageOperationScreen: FC = () => {
	return (
		<FormBox gap={8} width={'400px'} height={'300px'} justifyContent='space-between'>
			<Typography variant='body1'></Typography>

			<ModTextField fullWidth label='Name' variant='outlined' />
			<Button size='large' fullWidth variant='contained'>
				Создать
			</Button>
		</FormBox>
	)
}
