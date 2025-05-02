import { createContext, useContext, useEffect, useState } from 'react'

import { Box, Portal } from '@mui/material'

import { useWindowResizeContext } from './WindowResizeProvider'

interface SidebarContextType {
	isOpen: boolean
	isStatic: boolean
	toggleSidebar: () => void
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

export const SidebarProvider = ({ children }: { children: React.ReactNode }) => {
	const { matchMap } = useWindowResizeContext()
	const sidebarFixed = matchMap.tablet
	const [isOpen, setIsOpen] = useState(false)
	const [isStatic, setIsStatic] = useState(false)

	const toggleSidebar = () => {
		setIsOpen((prev) => !prev)
	}

	useEffect(() => {
		setIsStatic(sidebarFixed)
		setIsOpen(sidebarFixed) // Close the sidebar when the screen size changes
		// Logic to determine if the sidebar should be static
	}, [sidebarFixed])

	const contextValue = {
		isOpen,
		isStatic,
		toggleSidebar,
	}

	return (
		<SidebarContext.Provider value={contextValue}>
			<>
				{children}
				{isOpen && !isStatic && (
					<Portal container={() => document.getElementById('root')!}>
						<Box
							onClick={toggleSidebar}
							sx={{
								width: '100%',
								height: '100%',
								position: 'fixed',
								backgroundColor: 'rgba(0, 0, 0, 0.5)',
								top: 0,
								left: 0,
								right: 0,
								bottom: 0,
								zIndex: 999,
							}}
						/>
					</Portal>
				)}
			</>
		</SidebarContext.Provider>
	)
}

export const useSidebar = () => {
	const context = useContext(SidebarContext)
	if (context === undefined) {
		throw new Error('useSidebar must be used within a SidebarProvider')
	}
	return context
}
