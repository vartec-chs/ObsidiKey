import { AppBarHeight } from '@config/elements-size'
import { PATHS } from '@config/paths'

import { FC, useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'

import { getCurrentWindow } from '@tauri-apps/api/window'

import { colors, IconButton, AppBar as MuiAppBar, Stack, Tooltip, Typography } from '@mui/material'

import { HomeIcon, Maximize, Minimize, Minus, X } from 'lucide-react'

import { Logo } from '@components/Logo'
import { ThemeToggle } from '@components/ThemeToggle'

export const AppBar: FC = () => {
	const { pathname } = useLocation()
	const navigate = useNavigate()
	const [isFullscreen, setIsFullscreen] = useState(false)
	const [label, setLabel] = useState('')

	const appWindowRef = useRef(getCurrentWindow())
	const window = appWindowRef.current

	const isPasswordGenerator = window.label === 'password-generator'
	const isDashboard = pathname.includes(PATHS.DASHBOARD.ROOT)

	const toggleFullscreen = async () => {
		await window.setFullscreen(!isFullscreen)
		setIsFullscreen(!isFullscreen)
	}
	const closeWindow = async () => {
		await window.close()
	}
	const getTitle = async () => {
		return await window.title()
	}
	const minimizeWindow = async () => {
		await window.minimize()
	}

	const goHome = async () => {
		navigate(PATHS.HOME, { replace: true })
	}

	useEffect(() => {
		const updateTitle = async () => {
			const title = await getTitle()
			setLabel(title)
		}
		updateTitle()
	}, [])

	return (
		<MuiAppBar
			id='titlebar'
			elevation={0}
			className='titlebar'
			enableColorOnDark
			position='static'
			data-tauri-drag-region
			sx={(theme) => ({
				// background: 'transparent',
				borderRadius: 0,
				px: 0.5,
				py: 0.5,
				width: '100%',
				height: `${AppBarHeight}px`,
				boxSizing: 'border-box',
				backgroundColor: theme.palette.mode === 'dark' ? colors.grey[900] : colors.grey[100],
				borderBottom: `1px solid ${theme.palette.mode === 'dark' ? colors.grey[800] : colors.grey[200]}`,
			})}
		>
			{/* <Toolbar data-tauri-drag-region> */}
			<Stack
				direction='row'
				alignItems='center'
				justifyContent='space-between'
				data-tauri-drag-region
			>
				<Stack direction='row' alignItems='center' justifyContent='center' gap={1}>
					<Logo height={24} width={24} />
					<Typography
						variant='body1'
						fontWeight={400}
						fontSize='16px'
						sx={(theme) => ({
							color: theme.palette.text.primary,
						})}
					>
						{label}
					</Typography>
				</Stack>
				<Stack direction='row' alignItems='center' gap={1}>
					{isDashboard && (
						<Tooltip title='Главная'>
							<IconButton onClick={goHome} size='small'>
								<HomeIcon size={16} />
							</IconButton>
						</Tooltip>
					)}

					<ThemeToggle size={16} />

					<Tooltip title='Свернуть'>
						<IconButton onClick={minimizeWindow} size='small'>
							<Minus size={16} />
						</IconButton>
					</Tooltip>

					{!isPasswordGenerator && (
						<Tooltip
							title={!isFullscreen ? 'На весь экран' : 'Возвращается в обычное расположение'}
						>
							<IconButton onClick={toggleFullscreen} size='small'>
								{!isFullscreen ? <Maximize size={16} /> : <Minimize size={16} />}
							</IconButton>
						</Tooltip>
					)}

					<Tooltip title='Закрыть'>
						<IconButton
							onClick={closeWindow}
							size='small'
							sx={(theme) => ({
								':hover': {
									backgroundColor:
										theme.palette.mode === 'dark' ? colors.red[500] : colors.red[500],
									color: colors.grey[200],
								},
							})}
						>
							<X size={16} />
						</IconButton>
					</Tooltip>
				</Stack>
			</Stack>
			{/* </Toolbar> */}
		</MuiAppBar>
	)
}
