import type { FC, PropsWithChildren } from 'react'

import { DialogsProvider } from '@hooks/useDialogs'

import { ThemeProvider } from './ThemeProvider'
import { ToastProvider } from './ToastProvider'
import { WindowResizeProvider } from './WindowResizeProvider'

export const WrapperProvider: FC<PropsWithChildren> = ({ children }) => {
	return (
		<ThemeProvider>
			<ToastProvider />
			<DialogsProvider>
				<WindowResizeProvider>{children}</WindowResizeProvider>
			</DialogsProvider>
		</ThemeProvider>
	)
}
