import { INVOKE_COMMANDS } from '@config/invoke-commands'

import { BaseInvokeOptions, useInvoke } from '@hooks/useInvoke'

import type { PasswordStorageCreateDto } from '@ts/passwordStorage'

export const useCreatePasswordStorage = ({
	onError,
	onSuccess,
	onFinished,
	runOnMount,
}: BaseInvokeOptions<undefined>) => {
	const { data, isLoading, error, execute } = useInvoke<
		undefined,
		{ dto: PasswordStorageCreateDto }
	>({
		command: INVOKE_COMMANDS.PASSWORD_STORAGE.CREATE,
		runOnMount,
		onError,
		onSuccess,
		onFinished,
	})

	return { data, isLoading, error, execute }
}
