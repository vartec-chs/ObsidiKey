import { darkTheme, lightTheme } from '@config/theme'
import { settingsService } from '@services/settings.service'

import { createContext, useContext, useEffect, useState } from 'react'

import { app, path } from '@tauri-apps/api'

import { CssBaseline, ThemeProvider as MuiThemeProvider } from '@mui/material'

type ThemeContextType = {
	theme: 'light' | 'dark'
	setTheme: (theme: 'light' | 'dark') => void
}

export const ThemeContext = createContext<ThemeContextType>({
	theme: 'light',
	setTheme: () => {},
})

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
	const localTheme = localStorage.getItem('theme') as 'light' | 'dark' | null
	const [theme, setThemeState] = useState<'light' | 'dark'>('dark')

	useEffect(() => {
		const get = async () => {
			const settingsTheme = await settingsService.getTheme()
			const appDataDir = await path.appDataDir()
			console.log(appDataDir)
			if (settingsTheme) {
				setThemeState(settingsTheme || localTheme || 'dark')
			}
		}
		get()
	}, [])

	const setTheme = async (theme: 'light' | 'dark') => {
		setThemeState(theme)
		localStorage.setItem('theme', theme)
		await settingsService.setTheme(theme)
		await app.setTheme(theme)
	}

	const contextValue = {
		theme,
		setTheme,
	}

	return (
		<ThemeContext.Provider value={contextValue}>
			<MuiThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
				<CssBaseline />
				{children}
			</MuiThemeProvider>
		</ThemeContext.Provider>
	)
}

export const useTheme = () => {
	const context = useContext(ThemeContext)
	if (context === undefined) {
		throw new Error('useTheme must be used within a ThemeProvider')
	}
	return context
}
