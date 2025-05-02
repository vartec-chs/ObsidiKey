import { create } from 'zustand'

interface SidebarState {
	isOpen: boolean
	isStatic: boolean
	// toggleSidebar: () => void
}

export const useSidebar = create<SidebarState>((set) => ({
	isOpen: false,
	isStatic: false,
	// toggleSidebar: () => set((state) => ({ isOpen: !state.isOpen })),
}))
