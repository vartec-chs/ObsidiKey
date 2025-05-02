import type { FC, PropsWithChildren } from 'react'

import { DialogsProvider } from '@hooks/useDialogs'

import { ThemeProvider } from './ThemeProvider'
import { WindowResizeProvider } from './WindowResizeProvider'

export const WrapperProvider: FC<PropsWithChildren> = ({ children }) => {
	return (
		<ThemeProvider>
			<DialogsProvider>
				<WindowResizeProvider>{children}</WindowResizeProvider>
			</DialogsProvider>
		</ThemeProvider>
	)
}
