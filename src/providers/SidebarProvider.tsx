import {
	createContext,
	Dispatch,
	SetStateAction,
	useContext,
	useEffect,
	useLayoutEffect,
	useState,
} from 'react'

import { Box, Portal } from '@mui/material'

import { useWindowResizeContext } from './WindowResizeProvider'

interface SidebarContextType {
	isOpen: boolean
	isStatic: boolean
	isOpenRightbar: boolean
	isStaticRightbar: boolean
	width: { sidebar: number; rightbar: number }
	toggleSidebar: () => void
	toggleRightbar: () => void
	setWidth: Dispatch<SetStateAction<{ sidebar: number; rightbar: number }>>
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

export const SidebarProvider = ({ children }: { children: React.ReactNode }) => {
	const { matchMap, width: windowWidth } = useWindowResizeContext()
	console.log('SidebarProvider', { matchMap, windowWidth })
	const sidebarFixed = matchMap['desktop']
	const rightbarFixed = matchMap['tablet']
	const [isOpen, setIsOpen] = useState(false)
	const [isOpenRightbar, setIsOpenRightbar] = useState(false)
	const [width, setWidth] = useState<{ sidebar: number; rightbar: number }>({
		sidebar: 250,
		rightbar: (windowWidth || 250) / 2.5,
	})
	const [isStaticRightbar, setIsStaticRightbar] = useState(false)
	const [isStatic, setIsStatic] = useState(false)

	const toggleSidebar = () => {
		setIsOpen((prev) => !prev)
	}

	const toggleRightbar = () => {
		setIsOpenRightbar((prev) => !prev)
	}

	useLayoutEffect(() => {
		setIsStatic(sidebarFixed)
		setIsStaticRightbar(rightbarFixed)
		setIsOpen(sidebarFixed)
		setIsOpenRightbar(rightbarFixed)
	}, [sidebarFixed, rightbarFixed])

	useLayoutEffect(() => {
		if (sidebarFixed && isOpenRightbar) {
			setIsOpen(false)
			setIsStatic(false)
		} else {
			setIsOpen(true)
			setIsStatic(true)
		}
	}, [isOpenRightbar])

	useLayoutEffect(() => {
		if (windowWidth) {
			const sidebar = windowWidth >= 1200 ? windowWidth / 4.5 : 260
			const rightbar = windowWidth >= 1200 ? windowWidth / 3 : 400
			if (windowWidth >= 1000) {
				setIsStaticRightbar(true)
				setIsStatic(true)
			}
			setWidth({
				sidebar: sidebar,
				rightbar: windowWidth <= 1000 ? 350 : rightbar,
			})
		}
	}, [windowWidth])

	const contextValue = {
		isOpen,
		isStatic,
		toggleSidebar,
		isOpenRightbar,
		isStaticRightbar,
		toggleRightbar,
		width,
		setWidth,
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
