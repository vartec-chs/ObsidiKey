import { ModTextField } from '@ui/ModTextField'

import * as React from 'react'
import { Controller, useForm } from 'react-hook-form'

import { IconButton } from '@mui/material'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'

import { PlusIcon } from 'lucide-react'

import { TagSchema, tagSchema } from './form.schema'

export const TagModal = () => {
	const { control, handleSubmit, reset, formState } = useForm<TagSchema>({
		resolver: tagSchema,
		mode: 'all',
	})
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

	const onSubmit = async (data: TagSchema) => {
		console.log(data)
	}

	const resetForm = async () => {
		reset({
			name: '',
		})
	}

	return (
		<React.Fragment>
			<IconButton size='small' onClick={handleClickOpen}>
				<PlusIcon size={20} />
			</IconButton>
			<Dialog
				maxWidth={'xs'}
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
				<DialogTitle>Создать тег</DialogTitle>
				<DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
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
								label='Название тега'
								type='text'
								fullWidth
								variant='standard'
							/>
						)}
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose}>Отмена</Button>
					<Button type='button' disabled={!formState.isValid} onClick={handleSave}>
						Сохранить
					</Button>
				</DialogActions>
			</Dialog>
		</React.Fragment>
	)
}
