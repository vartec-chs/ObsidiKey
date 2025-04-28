// import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
// import { Box, useMediaQuery } from '@mui/material';

// const SidebarContext = createContext<SidebarState | null>(null);

// function useSidebar() {
//   const context = useContext(SidebarContext);
//   if (!context) {
//     throw new Error('useSidebar must be used within a SidebarProvider.');
//   }
//   return context;
// }

// interface SidebarProviderProps {
//   defaultOpen?: boolean;
//   open?: boolean;
//   onOpenChange?: (open: boolean) => void;
//   collapsible?: 'offcanvas' | 'permanent' | 'temporary';
//   children: React.ReactNode;
// }

// interface SidebarState {
//   state: 'expanded' | 'collapsed';
//   open: boolean;
//   setOpen: (value: boolean | ((prev: boolean) => boolean)) => void;
//   isMobile: boolean;
//   openMobile: boolean;
//   setOpenMobile: (value: boolean | ((prev: boolean) => boolean)) => void;
//   toggleSidebar: () => void;
//   collapsible: 'offcanvas' | 'permanent' | 'temporary';
// }

// const SidebarProvider = ({
//   defaultOpen = true,
//   open: openProp,
//   onOpenChange: setOpenProp,
//   collapsible = 'offcanvas',
//   children,
//   ...props
// }: SidebarProviderProps) => {
//   const isMobile = useMediaQuery('(max-width: 768px)');
//   const [openMobile, setOpenMobile] = useState(false);
//   const [_open, _setOpen] = useState(defaultOpen);
//   const open = openProp ?? _open;

//   const setOpen = useCallback(
//     (value: boolean | ((prev: boolean) => boolean)) => {
//       const openState = typeof value === 'function' ? value(open) : value;
//       if (setOpenProp) {
//         setOpenProp(openState);
//       } else {
//         _setOpen(openState);
//       }
//       // Optionally set a cookie here if persistence is needed
//     },
//     [setOpenProp, open]
//   );

//   const toggleSidebar = useCallback(() => {
//     if (isMobile) {
//       setOpenMobile((prev: boolean) => !prev);
//     } else {
//       setOpen((prev: boolean) => !prev);
//     }
//   }, [isMobile, setOpen, setOpenMobile]);

//   useEffect(() => {
//     const handleKeyDown = (event: KeyboardEvent) => {
//       if (event.key === 'b' && (event.metaKey || event.ctrlKey)) {
//         event.preventDefault();
//         toggleSidebar();
//       }
//     };
//     window.addEventListener('keydown', handleKeyDown);
//     return () => window.removeEventListener('keydown', handleKeyDown);
//   }, [toggleSidebar]);

//   const state = open ? 'expanded' : 'collapsed';

//   const contextValue = {
//     state,
//     open,
//     setOpen,
//     isMobile,
//     openMobile,
//     setOpenMobile,
//     toggleSidebar,
//     collapsible,
//   };

//   return (
//     <SidebarContext.Provider value={
// 			contextValue
// 		}>
//       <Box sx={{ display: 'flex', minHeight: '100vh' }} {...props}>
//         {children}
//       </Box>
//     </SidebarContext.Provider>
//   );
// };

// export { SidebarProvider, useSidebar };