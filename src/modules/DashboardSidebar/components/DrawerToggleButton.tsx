import { useSidebar } from '@/providers/SidebarProvider'

import { FC } from 'react'

import { IconButton } from '@mui/material'

import { MenuIcon } from 'lucide-react'

import { AnimatePresence, motion } from 'motion/react'

// interface DrawerToggleButtonProps {
// 	isOpen: boolean
// 	isStatic: boolean
// 	onClick: () => void
// }

export const DrawerToggleButton: FC = () => {
	const { isOpen, isStatic, toggleSidebar } = useSidebar()
	return (
		<AnimatePresence>
			{!isOpen && !isStatic && (
				<motion.div
					initial={{ opacity: 0, scale: 0.8, x: -5 }}
					animate={{ opacity: 1, scale: 1, x: 0 }}
					exit={{ opacity: 0, scale: 0.8, x: -5 }}
					transition={{ duration: 0.2 }}
					style={{paddingLeft: 12}}

					// style={{ position: 'absolute', top: 5, left: 15, zIndex: 1000 }}
				>
					<IconButton color='inherit' aria-label='open drawer' onClick={toggleSidebar} edge='start'>
						<MenuIcon />
					</IconButton>
				</motion.div>
			)}
		</AnimatePresence>
	)
}
