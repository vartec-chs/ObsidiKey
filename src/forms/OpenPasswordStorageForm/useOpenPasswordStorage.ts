import { INVOKE_COMMANDS } from '@config/invoke-commands'

import { BaseInvokeOptions, useInvoke } from '@hooks/useInvoke'

import type { PasswordStorageOpenDto } from '@ts/passwordStorage'

export const useOpenPasswordStorage = ({
	onError,
	onSuccess,
	onFinished,
	runOnMount,
}: BaseInvokeOptions<undefined>) => {
	const { data, isLoading, error, execute } = useInvoke<undefined, { dto: PasswordStorageOpenDto }>(
		{
			command: INVOKE_COMMANDS.PASSWORD_STORAGE.OPEN,
			runOnMount,
			onError,
			onSuccess,
			onFinished,
		},
	)

	return { data, isLoading, error, execute }
}
