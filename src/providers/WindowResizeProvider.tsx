// contexts/WindowResizeContext.tsx
import { createContext, FC, PropsWithChildren, useContext } from 'react'

import { ResizeCondition, useWindowResize } from '@hooks/useWindowResize'

const MATCHES: ResizeCondition[] = [
	{ id: 'mobile', match: ({ width }) => width < 600 },
	{ id: 'desktop', match: ({ width }) => width >= 600 && width < 900 },
	{ id: 'tablet', match: ({ width }) => width >= 900 },
]

interface WindowResizeContextProps {
	matchMap: Record<string, boolean>
	width: number | null
	height: number | null
}

const WindowResizeContext = createContext<WindowResizeContextProps | undefined>(undefined)

export const useWindowResizeContext = (): WindowResizeContextProps => {
	const context = useContext(WindowResizeContext)
	if (!context) {
		throw new Error('useWindowResizeContext must be used within WindowResizeProvider')
	}
	return context
}

export const WindowResizeProvider: FC<PropsWithChildren> = ({ children }) => {
	const { matchMap, width, height } = useWindowResize({
		debounce: 300,
		leading: true,
		matches: MATCHES,
	})

	console.log('WindowResizeProvider rerender')
	return (
		<WindowResizeContext.Provider value={{ matchMap, width, height }}>
			{children}
		</WindowResizeContext.Provider>
	)
}
