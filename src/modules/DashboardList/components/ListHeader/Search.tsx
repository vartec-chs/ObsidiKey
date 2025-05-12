import { MotionMuiStack } from '@ui/MotionMuiStack'
import { AnimatePresence, motion } from 'framer-motion'

import { FC, useState } from 'react'

import { IconButton, InputAdornment, Stack, TextField, Typography } from '@mui/material'

import { HomeIcon, SearchIcon, XIcon } from 'lucide-react'

export const Search: FC = () => {
	const [open, setOpen] = useState(false)
	const [onFocus, setOnFocus] = useState(false)
	return (
		<AnimatePresence presenceAffectsLayout mode='popLayout'>
			{!open ? (
				<MotionMuiStack
					initial={{ opacity: 0, scale: 0.8, y: -50 }}
					animate={{ opacity: 1, scale: 1, y: 0 }}
					exit={{ opacity: 0, scale: 0.8, y: -50 }}
					key='move'
					layout
					direction='row'
					alignItems='center'
					justifyContent='space-between'
					width='100%'
					gap={1}
				>
					<Stack direction='row' alignItems='center' width='100%' gap={1}>
						<HomeIcon />
						<Typography variant='subtitle1'>Все</Typography>
					</Stack>
					<IconButton onClick={() => setOpen(!open)}>
						<SearchIcon size={20} />
					</IconButton>
				</MotionMuiStack>
			) : (
				<motion.div
					initial={{ opacity: 0, scale: 0.8, y: -50 }}
					animate={{ opacity: 1, scale: 1, y: 0 }}
					exit={{ opacity: 0, scale: 0.8, y: -50 }}
					style={{ width: '100%' }}
					layout
				>
					<TextField
						fullWidth
						label='Поиск'
						sx={{
							'& .MuiInputBase-root': {
								padding: 0,
								paddingRight: 0.5,
							},
						}}
						onFocus={() => {
							setOpen(true)
							setOnFocus(true)
						}}
						onBlur={() => {
							// setOpen(false)
							setOnFocus(false)
						}}
						placeholder='Поиск в категории Все'
						size='small'
						slotProps={{
							input: {
								endAdornment: (
									<InputAdornment position='end'>
										{onFocus && (
											<IconButton
												size='small'
												sx={(theme) => ({
													borderRadius: theme.shape.borderRadius,
												})}
											>
												<SearchIcon size={18} />
											</IconButton>
										)}
										<IconButton
											onClick={() => setOpen(false)}
											size='small'
											sx={(theme) => ({
												borderRadius: theme.shape.borderRadius,
											})}
										>
											<XIcon size={18} />
										</IconButton>
									</InputAdornment>
								),
							},
						}}
					/>
				</motion.div>
			)}
		</AnimatePresence>
	)
}
