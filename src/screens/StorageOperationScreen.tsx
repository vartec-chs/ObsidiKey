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

	return (
		<FormBox headerContent={header} gap={8} >
			{mode === 'create' ? <CreatePasswordStorageForm /> : <OpenPasswordStorageForm />}
		</FormBox>
	)
}
