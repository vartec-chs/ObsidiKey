import { PATHS } from '@config/paths'

import { createBrowserRouter } from 'react-router'

import { AnimationLayout } from '@layouts/AnimationLayout'
import { BackButtonLayout } from '@layouts/BackButtonLayout'
import { DashboardLayout } from '@layouts/DashboardLayout'
import { MainLayout } from '@layouts/MainLayout'

import { DashboardScreen } from '@screens/DashboardScreen'
import { FirstOpenScreen } from '@screens/FirstOpenScreen'
import { HomeScreen } from '@screens/HomeScreen'
import { StorageOperationScreen } from '@screens/StorageOperationScreen'

export const router = createBrowserRouter([
	{
		path: PATHS.HOME,
		element: <MainLayout />,
		children: [
			{
				path: PATHS.HOME,
				element: <BackButtonLayout />,
				children: [
					{
						path: PATHS.HOME,
						element: <AnimationLayout />,
						children: [
							{
								index: true,
								element: <HomeScreen />,
							},
							{
								path: PATHS.FIRST_OPEN,
								element: <FirstOpenScreen />,
							},
							{
								path: PATHS.PASSWORD_STORAGE.ROOT,
								element: <StorageOperationScreen />,
							},
						],
					},
				],
			},
			{
				path: PATHS.DASHBOARD.ROOT,
				element: <DashboardLayout />,
				children: [
					{
						index: true,
						element: <DashboardScreen />,
					},
				],
			},
		],
	},
])
