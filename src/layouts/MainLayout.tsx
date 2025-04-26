import { AppBarHeight, BottomBarHeight } from '@config/elements-size'
import { AppBar } from '@modules/AppBar'
import { BottomBar } from '@modules/BottomBar'

import type { FC, PropsWithChildren } from 'react'
import { Outlet } from 'react-router'

import { Box, Stack } from '@mui/material'

export const MainLayout: FC = () => {
	return (
		<Stack
			component='main'
			width='100vw'
			height='100vh'
			gap={0}
			m={0}
			p={0}
			alignItems='center'
			direction='column'
			justifyContent='space-between'
		>
			<AppBar />
			<ContentWrapper>
				<Outlet />
			</ContentWrapper>
			<BottomBar />
		</Stack>
	)
}

export const ContentWrapper: FC<PropsWithChildren> = ({ children }) => {
	return (
		<Box
			position='relative'
			overflow='hidden'
			component='main'
			width='100%'
			height={`calc(100% - ${AppBarHeight + BottomBarHeight}px)`}
		>
			{children}
		</Box>
	)
}
