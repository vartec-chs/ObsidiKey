import type { FC, PropsWithChildren } from 'react'

import { DialogsProvider } from '@hooks/useDialogs'

import { ThemeProvider } from './ThemeProvider'

export const WrapperProvider: FC<PropsWithChildren> = ({ children }) => {
	return (
		<ThemeProvider>
			<DialogsProvider>{children}</DialogsProvider>
		</ThemeProvider>
	)
}
