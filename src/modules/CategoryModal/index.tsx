import { INVOKE_COMMANDS } from '@/config/invoke-commands'
import { useInvoke } from '@/hooks/useInvoke'
import { useNotifications } from '@/hooks/useNotifications'
import { ModTextField } from '@ui/ModTextField'

import * as React from 'react'
import { Controller, useForm } from 'react-hook-form'

import { open as openDialog } from '@tauri-apps/plugin-dialog'

import { Box, CircularProgress, IconButton, Stack } from '@mui/material'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import TextField from '@mui/material/TextField'

import { FileUp, PlusIcon, TrashIcon, XIcon } from 'lucide-react'

import { zodResolver } from '@hookform/resolvers/zod'

import { CategorySchema, categorySchema } from './form.schema'

export const CategoryModal = () => {
	const { control, handleSubmit, setValue, clearErrors, reset, watch, formState } =
		useForm<CategorySchema>({
			resolver: zodResolver(categorySchema),
			mode: 'all',
		})
	const toast = useNotifications()
	const [open, setOpen] = React.useState(false)

	const handleClickOpen = () => {
		setOpen(true)
	}

	const handleClose = async () => {
		setOpen(false)
		resetForm()
	}
	const handleSave = async () => {
		handleClose()
		handleSubmit(onSubmit)
		resetForm()
	}

	const onSubmit = async (data: CategorySchema) => {
		console.log(data)
	}

	const iconFromBase64 = useInvoke<string, { path: string }>({
		command: INVOKE_COMMANDS.ICON.CONVERT_TO_BASE_64,
		onError: (error) => {
			console.log(error)
			toast.show(error.message, { severity: 'error' })
		},
		onSuccess: (res) => {
			console.log(res)
			setValue('icon', res.data)
		},
	})

	const resetForm = async () => {
		reset({
			name: '',
			description: '',
			icon: '',
			iconPath: '',
		})
	}

	const openIcon = async () => {
		await openDialog({
			title: 'Открытие иконки',
			message: 'Выберите иконку',
			filters: [
				{
					name: 'Image',
					extensions: ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'],
				},
			],
		})
			.then((path) => {
				if (path) {
					setValue('iconPath', path)
					iconFromBase64.execute({ path })
				} else {
					toast.show('Путь не выбран', { severity: 'warning' })
				}
			})
			.catch(() => {
				toast.show('Путь не выбран', { severity: 'error' })
			})
	}

	const icon = watch('icon')

	return (
		<React.Fragment>
			<IconButton size='small' onClick={handleClickOpen}>
				<PlusIcon size={20} />
			</IconButton>
			<Dialog
				maxWidth={'sm'}
				fullWidth
				open={open}
				onClose={handleClose}
				onSubmit={() => handleSubmit(onSubmit)}
				slotProps={{
					paper: {
						component: 'form',
					},
				}}
			>
				<DialogTitle>Создать категорию</DialogTitle>
				<DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
					<Stack spacing={2} direction='row' alignItems='center' justifyContent='space-between'>
						<Stack direction='row' spacing={0.5} alignItems='center'>
							<Box
								sx={(theme) => ({
									border: `1px solid ${theme.palette.divider}`,
									height: '64px',
									width: '64px',
									borderRadius: theme.spacing(1),
									padding: theme.spacing(0.3),
									display: 'flex',
									justifyContent: 'center',
									alignItems: 'center',
								})}
							>
								{icon && (
									<img
										src={icon}
										alt='icon'
										width={'100%'}
										height={'100%'}
										style={{
											objectFit: 'contain',
											objectPosition: 'center',
										}}
									/>
								)}
								{iconFromBase64.isLoading && <CircularProgress size={32} color='primary' />}
							</Box>
							<Stack direction='column' spacing={0.5}>
								<IconButton
									disabled={iconFromBase64.isLoading}
									size='small'
									onClick={() => {
										setValue('icon', '')
										setValue('iconPath', '')
									}}
								>
									<TrashIcon size={20} />
								</IconButton>
								<IconButton size='small' onClick={openIcon} disabled={iconFromBase64.isLoading}>
									<FileUp size={20} />
								</IconButton>
							</Stack>
						</Stack>
						<Controller
							name='name'
							control={control}
							render={({ field }) => (
								<ModTextField
									{...field}
									autoFocus
									required
									id='name'
									name='name'
									label='Название категории'
									type='text'
									fullWidth
									variant='standard'
								/>
							)}
						/>
					</Stack>

					<Controller
						name='description'
						control={control}
						render={({ field }) => (
							<ModTextField
								{...field}
								required
								multiline
								id='description'
								name='description'
								label='Описание'
								type='text'
								fullWidth
								variant='standard'
								rows={3}
							/>
						)}
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose}>Отмена</Button>
					<Button
						type='button'
						disabled={!formState.isValid || iconFromBase64.isLoading}
						onClick={handleSave}
					>
						Сохранить
					</Button>
				</DialogActions>
			</Dialog>
		</React.Fragment>
	)
}
