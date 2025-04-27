import { AnimatedSegmentedTabs } from '@/ui/AnimatedMuiTabs'
import { AnimatedMuiTabs2 } from '@/ui/AnimatedMuiTabs2'
import { PATHS } from '@config/paths'
import { CreatePasswordStorageForm } from '@forms/CreatePasswordStorageForm'
import { OpenPasswordStorageForm } from '@forms/OpenPasswordStorageForm'
import { FormBox } from '@ui/FormBox'
import { Segment, SegmentedControl } from '@ui/SegmentedControl'

import type { FC } from 'react'
import { useNavigate, useSearchParams } from 'react-router'

export const StorageOperationScreen: FC = () => {
	const [searchParams] = useSearchParams()
	const mode = searchParams.get('mode') || 'create'

	const navigate = useNavigate()

	const switchPage = (value: 'create' | 'open') => {
		if (value === 'create') {
			navigate(PATHS.PASSWORD_STORAGE.CREATE, { replace: true })
		} else {
			navigate(PATHS.PASSWORD_STORAGE.OPEN, { replace: true })
		}
	}

	const header = (
		<SegmentedControl
			sx={{ height: '50px' }}
			onChange={(_, value) => switchPage(value)}
			value={mode}
		>
			<Segment value='create' label='Создать' />
			<Segment value='open' label='Открыть' />
		</SegmentedControl>
	)

	const tabs = [
		{ id: 0, label: 'Создать', content: <CreatePasswordStorageForm /> },
		{ id: 1, label: 'Открыть', content: <OpenPasswordStorageForm /> },
	]

	return (
		<AnimatedSegmentedTabs
			tabs={tabs}
			defaultTab={mode === 'create' ? 0 : 1}
			onChange={(tabId) => {
				if (tabId === 0) {
					navigate(PATHS.PASSWORD_STORAGE.CREATE, { replace: true })
				} else {
					navigate(PATHS.PASSWORD_STORAGE.OPEN, { replace: true })
				}
			}}
		/>
	)
}
