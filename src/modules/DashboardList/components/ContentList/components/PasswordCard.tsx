// import { useDashboardStore } from '@store'
import { useSidebar } from '@/providers/SidebarProvider'

import { type FC, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'

import {
	Card,
	CardActionArea,
	CardActions,
	Chip,
	colors,
	Divider,
	IconButton,
	Stack,
	Tooltip,
	Typography,
} from '@mui/material'

import { HomeIcon, KeyRound, Link, Star, TagIcon, UserIcon } from 'lucide-react'

import { AnimatePresence, motion } from 'motion/react'

import { useHover } from '@hooks'

interface PasswordCardProps {
	id: string
}

const MotionCard = motion(Card)

export const PasswordCard: FC<PasswordCardProps> = ({ id }) => {
	// const theme = useTheme()
	const refPaper = useRef<HTMLDivElement>(null)
	const { toggleRightbar } = useSidebar()
	const [open, setOpen] = useState(false)
	const { pathname } = useLocation()
	const navigate = useNavigate()
	const hovering = useHover(refPaper)

	// const { currentCardId, setCurrentCardId } = useDashboardStore()

	// Можно заменить на реальные данные
	const tags: string[] = [] // если пусто — верхний блок будет анимирован
	const isFavorite = true

	const openPassword = () => {
		toggleRightbar()
		// if (id !== currentCardId) {
		// 	setCurrentCardId(id)
		// }
		// if (pathname.includes(PATHS.DASHBOARD.VIEW_PASSWORD.ROOT)) return
		// navigate(PATHS.DASHBOARD.VIEW_PASSWORD.ROOT)
	}
	const StarIcon = (
		<Star
			size={18}
			fill={isFavorite ? colors.yellow[700] : 'transparent'}
			color={isFavorite ? colors.yellow[700] : colors.grey[500]}
		/>
	)

	return (
		<MotionCard
			ref={refPaper}
			sx={(theme) => ({
				width: '100%',
				overflow: 'hidden',
				boxShadow: 'none',
				backgroundColor: theme.palette.mode === 'dark' ? '' : colors.grey[100],
			})}
			whileHover={{ boxShadow: '0px 2px 3px rgba(0,0,0,0.1)' }}
			whileTap={{ scale: 0.98 }}
			layout // позволяет анимировать высоту и layout
			transition={{ type: 'spring', stiffness: 250, damping: 20 }}
		>
			<AnimatePresence mode='wait'>
				{/* Верхний блок — если тегов нет, показываем только при ховере */}
				{tags.length === 0 && hovering && (
					<motion.div
						key='top-actions-no-tags'
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: 'auto' }}
						exit={{ opacity: 0, height: 0 }}
						transition={{ duration: 0.3 }}
					>
						<CardActions sx={{ padding: 0.2 }}>
							<Stack width='100%' direction='row' justifyContent='flex-end'>
								<IconButton size='small' onClick={() => setOpen(!open)}>
									{StarIcon}
								</IconButton>
							</Stack>
						</CardActions>
					</motion.div>
				)}

				{/* Верхний блок — если есть теги */}
				{tags.length > 0 && (
					<motion.div
						key='top-actions-tags'
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: 'auto' }}
						exit={{ opacity: 0, height: 0 }}
						transition={{ duration: 0.3 }}
					>
						<CardActions sx={{ padding: 0.2 }}>
							<Stack width='100%' direction='row' gap={0.5} justifyContent='flex-end'>
								<Stack
									direction='row'
									gap={0.5}
									p={0.2}
									pr={0}
									sx={(theme) => ({
										overflowX: 'auto',
										overflowY: 'hidden',
										scrollbarGutter: 'stable',
										'&::-webkit-scrollbar': {
											height: '4px',
										},
										'&::-webkit-scrollbar-track': {
											background: theme.palette.mode === 'dark' ? '#222' : '#f0f0f0',
											borderRadius: '8px',
										},
										'&::-webkit-scrollbar-thumb': {
											background: theme.palette.mode === 'dark' ? '#444' : '#bbb',
											borderRadius: '8px',
											'&:hover': {
												background: theme.palette.mode === 'dark' ? '#666' : '#999',
											},
										},
									})}
								>
									{tags.map((tag, index) => (
										<Chip
											size='small'
											icon={<TagIcon size={14} />}
											variant='outlined'
											key={index}
											label={tag}
										/>
									))}
								</Stack>
								<IconButton size='small' onClick={() => setOpen(!open)}>
									{StarIcon}
								</IconButton>
							</Stack>
						</CardActions>
					</motion.div>
				)}
			</AnimatePresence>

			<CardActionArea onClick={openPassword}>
				<Stack direction='row'>
					<Stack mt={1} ml={1} direction='column' gap={1.5} alignItems='center'>
						<HomeIcon size={24} />
						{/* {StarIcon} */}
					</Stack>
					<Stack flex={1} direction='column' gap={1} sx={{ padding: 1 }}>
						<Stack direction='row' gap={1} alignItems='center' justifyContent='space-between'>
							<Typography
								variant='body2'
								sx={{
									display: '-webkit-box',
									WebkitLineClamp: 2,
									WebkitBoxOrient: 'vertical',
									overflow: 'hidden',
									textOverflow: 'ellipsis',
									wordBreak: 'break-word',
								}}
							>
								Name
							</Typography>
						</Stack>
						<Divider />
						<Stack direction='column' gap={1}>
							<motion.div
								initial={false}
								animate={{
									maxHeight: hovering ? 72 : 24, // 3 строки ≈ 3 * 24px, 1 строка — 24px
								}}
								transition={{ duration: 0.3 }}
								style={{ overflow: 'hidden' }}
							>
								<Typography
									variant='body2'
									sx={{
										opacity: hovering ? 1 : 0.5,
										display: '-webkit-box',
										WebkitLineClamp: hovering ? 3 : 1,
										WebkitBoxOrient: 'vertical',
										overflow: 'hidden',
										textOverflow: 'ellipsis',
										transition: 'opacity 0.3s',
										wordBreak: 'break-word',
									}}
								>
									Description
								</Typography>
							</motion.div>
						</Stack>
					</Stack>
					<Stack />
				</Stack>
			</CardActionArea>

			{/* Нижний блок: появляется при наведении */}
			<AnimatePresence>
				{hovering && (
					<motion.div
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: 'auto' }}
						exit={{ opacity: 0, height: 0 }}
						transition={{ duration: 0.3 }}
					>
						<CardActions>
							<Stack direction='row' gap={1}>
								<Tooltip title='Скопировать логин'>
									<IconButton onClick={() => {}}>
										<UserIcon size={20} />
									</IconButton>
								</Tooltip>
								<Tooltip title='Скопировать пароль'>
									<IconButton onClick={() => {}}>
										<KeyRound size={20} />
									</IconButton>
								</Tooltip>
								<Tooltip title='Скопировать URL'>
									<IconButton onClick={() => {}}>
										<Link size={20} />
									</IconButton>
								</Tooltip>
							</Stack>
						</CardActions>
					</motion.div>
				)}
			</AnimatePresence>
		</MotionCard>
	)
}
