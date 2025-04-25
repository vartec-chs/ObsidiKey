import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router'

import { WrapperProvider } from '@providers/WrapperProvider'

import { router } from './routing'

import '@styles/fonts.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<WrapperProvider>
		<RouterProvider router={router} />
	</WrapperProvider>,
)
