import { EXTENSION_FILE, EXTENSION_NAME, logger } from '@config/main'
import { LoadingButton } from '@ui/LoadingButton'
import { ModTextField } from '@ui/ModTextField'

import { FC, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router'
import { toast } from 'react-toastify'

import { save as saveDialog } from '@tauri-apps/plugin-dialog'

import { IconButton, InputAdornment, Stack } from '@mui/material'

import { Eye, EyeOff } from 'lucide-react'

import { zodResolver } from '@hookform/resolvers/zod'

import { CreatePasswordStorageSchema, createPasswordStorageSchema } from './schema'
import { useCreatePasswordStorage } from './useCreatePasswordStorage'

export const CreatePasswordStorageForm: FC = () => {
	const navigate = useNavigate()
	const [isKeyVisible, setIsKeyVisible] = useState(false)

	const {
		control,
		reset,
		handleSubmit,
		formState: { errors, isValid },
	} = useForm<CreatePasswordStorageSchema>({
		resolver: zodResolver(createPasswordStorageSchema),
		mode: 'onChange',
	})

	const createStorage = useCreatePasswordStorage({
		onError: (error) => toast.error(error.message),
		onSuccess: () => {
			toast.success('Создано'), reset()
		},
	})

	const onSave = async (data: CreatePasswordStorageSchema) => {
		const path = await saveDialog({
			defaultPath: `${data.name}.${EXTENSION_FILE}`,
			filters: [
				{
					name: EXTENSION_NAME,
					extensions: [EXTENSION_FILE],
				},
			],
		})

		if (path) {
			logger.info(JSON.stringify({ path, ...data }))
			await createStorage.execute({
				dto: {
					name: data.name,
					description: data.description,
					path,
					masterPassword: data.masterPassword,
				},
			})
		} else {
			toast.error('Путь не выбран')
		}
	}

	return (
		<Stack
			width={'100%'}
			height={'fit-content'}
			maxHeight={'400px'}
			// sx={{
			// 	overflowY: 'auto',
			// 	overflow: 'auto',
			// 	'&::-webkit-scrollbar': { scrollbarWidth: 'thin' },
			// 	'&::-webkit-scrollbar-thumb': { backgroundColor: 'rgba(0,0,0,.1)', borderRadius: 4 },
			// 	'&::-webkit-scrollbar-track': { backgroundColor: 'rgba(0,0,0,.1)', borderRadius: 4 },
			// 	'&::-webkit-scrollbar:horizontal': { height: 4 },
			// 	'&::-webkit-scrollbar:vertical': { width: 4 },
			// }}
			component='form'
			onSubmit={handleSubmit(onSave)}
			gap={2}
		>
			<Controller
				name='name'
				control={control}
				render={({ field }) => (
					<ModTextField
						{...field}
						autoFocus
						fullWidth
						// sx={{
						// 	mt: 0.6,
						// }}
						label='Название хранилища паролей'
						error={!!errors.name}
						helperText={errors.name?.message}
						autoComplete='off'
						required
					/>
				)}
			/>

			<Controller
				name='description'
				control={control}
				render={({ field }) => (
					<ModTextField
						{...field}
						fullWidth
						label='Описание хранилища паролей'
						multiline
						maxRows={4}
						autoComplete='off'
						error={!!errors.description}
						helperText={errors.description?.message}
					/>
				)}
			/>
			<Controller
				name='masterPassword'
				control={control}
				render={({ field: { ref, ...field } }) => (
					<ModTextField
						{...field}
						fullWidth
						inputRef={ref}
						autoComplete='off'
						required
						type={isKeyVisible ? 'text' : 'password'}
						label='Ключ шифрования'
						error={!!errors.masterPassword}
						helperText={errors.masterPassword?.message}
						slotProps={{
							input: {
								endAdornment: (
									<InputAdornment position='end'>
										<IconButton onClick={() => setIsKeyVisible(!isKeyVisible)}>
											{isKeyVisible ? <Eye size={24} /> : <EyeOff size={24} />}
										</IconButton>
									</InputAdornment>
								),
							},
						}}
					/>
				)}
			/>
			<LoadingButton
				isLoading={createStorage.isLoading}
				type='submit'
				size='large'
				variant='contained'
				disabled={!isValid || createStorage.isLoading}
			>
				Создать
			</LoadingButton>
		</Stack>
	)
}
