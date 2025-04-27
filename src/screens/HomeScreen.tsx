import { PATHS } from '@config/paths'
import { FormBox } from '@ui/FormBox'

import type { FC } from 'react'
import { useNavigate } from 'react-router'

import { Button, Divider, Stack, Typography } from '@mui/material'

import { LockKeyholeIcon } from 'lucide-react'

import { Logo } from '@components/Logo'

import { useNotifications } from '@hooks/useNotifications'

export const HomeScreen: FC = () => {
	const navigate = useNavigate()
	const notifications = useNotifications()

	const handleCreateStorage = () => {
		navigate(PATHS.PASSWORD_STORAGE.CREATE)
	}

	const handleOpenStorage = () => {
		navigate(PATHS.PASSWORD_STORAGE.OPEN)
	}

	const handleSetGlobalPassword = () => {
		navigate(PATHS.FIRST_OPEN)
	}

	const header = (
		<Stack direction='row' alignItems='center' justifyContent='center' gap={1}>
			<Logo height={64} width={64} />
			<Typography variant='h4'>ObsidiKey</Typography>
		</Stack>
	)
	return (
		<FormBox headerContent={header} gap={12} width={'400px'} height={'fit-content'}>
			<Button fullWidth variant='contained' size='large' onClick={handleOpenStorage}>
				Открыть хранилище
			</Button>

			<Button fullWidth variant='outlined' size='large' onClick={handleCreateStorage}>
				Создать хранилище
			</Button>

			<Divider flexItem />
			<Button
				fullWidth
				color='warning'
				variant='text'
				size='large'
				onClick={() =>
					notifications.show('Hello world', { severity: 'success', actionText: 'Close' })
				}
				startIcon={<LockKeyholeIcon />}
			>
				Генератор паролей
			</Button>

			{/* <Button onClick={handleSetGlobalPassword} fullWidth color='warning' variant='text' size='large' startIcon={<LockKeyholeIcon />}>
				Назначить глобальный пароль
			</Button> */}
		</FormBox>
	)
}
