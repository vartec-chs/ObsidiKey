import { PATHS } from '@config/paths'

import { createBrowserRouter } from 'react-router'

import { AnimationLayout } from '@layouts/AnimationLayout'
import { BackButtonLayout } from '@layouts/BackButtonLayout'
import { MainLayout } from '@layouts/MainLayout'

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
		],
	},
])
