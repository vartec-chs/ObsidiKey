import { PATHS } from '@config/paths'
import { FormBox } from '@ui/FormBox'
import { ModTextField } from '@ui/ModTextField'

import type { FC } from 'react'
import { useNavigate } from 'react-router'

import { Button, Stack, Typography } from '@mui/material'

import { LockKeyholeIcon } from 'lucide-react'

import { Logo } from '@components/Logo'

const header = (
	<Stack direction='row' alignItems='center' justifyContent='center' gap={1}>
		<Logo height={64} width={64} />
		<Typography variant='h4'>ObsidiKey</Typography>
	</Stack>
)
export const SetGlobalPasswordForm: FC = () => {
	const navigate = useNavigate()

	const handleCreateStorage = () => {
		navigate(PATHS.HOME)
	}

	const onSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		handleCreateStorage()
	}

	return (
		<FormBox
			headerContent={header}
			gap={12}
			width={'400px'}
			height={'fit-content'}
			formComponent={'form'}
			formProps={{ onSubmit: onSubmit }}
		>
			<ModTextField type='password' fullWidth label='Пароль' />
			<ModTextField type='password' fullWidth label='Повторите пароль' />

			<Typography variant='body1' sx={{ opacity: 0.5 }}>
				Этот пароль будет использоваться для шифрования главного файла где вы можете хранить свои
				ключи от хранилищ, а также сессии для синхронизации между устройствами.
			</Typography>

			<Button
				type='submit'
				// onClick={handleCreateStorage}
				fullWidth
				color='error'
				variant='text'
				size='large'
				startIcon={<LockKeyholeIcon />}
			>
				Назначить глобальный пароль
			</Button>
		</FormBox>
	)
}
