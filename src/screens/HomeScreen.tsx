import { PATHS } from '@config/paths'
import { FormBox } from '@ui/FormBox'
import { ModTextField } from '@ui/ModTextField'

import type { FC } from 'react'
import { useNavigate } from 'react-router'

import { Button, Divider, Stack, TextField, Typography } from '@mui/material'

import { LockKeyholeIcon } from 'lucide-react'

import { Logo } from '@components/Logo'

export const HomeScreen: FC = () => {
	const navigate = useNavigate()

	const handleCreateStorage = () => {
		navigate(PATHS.CREATE_STORAGE)
	}

	const header = (
		<Stack direction='row' alignItems='center' justifyContent='center' gap={1}>
			<Logo height={64} width={64} />
			<Typography variant='h4'>ObsidiKey</Typography>
		</Stack>
	)
	return (
		<FormBox headerContent={header} gap={12} width={'400px'} height={'fit-content'}>
			<Button fullWidth variant='contained' size='large'>
				Открыть хранилище
			</Button>

			<Button fullWidth variant='outlined' size='large'>
				Создать хранилище
			</Button>

			<Divider flexItem />
			<Button fullWidth color='warning' variant='text' size='large' startIcon={<LockKeyholeIcon />}>
				Генератор паролей
			</Button>
		</FormBox>
	)
}
