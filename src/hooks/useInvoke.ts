import { useEffect, useState } from 'react'

import { invoke } from '@tauri-apps/api/core'

type ApiResult<T = unknown> = {
	data: T
	message: string
	status_code: number
	is_success: boolean
}

type InvokeArgs = {
	[key: string]: any
}

type InvokeError<T = unknown> = ApiResult<T>

interface UseInvoke<Return, Params extends InvokeArgs = {}> {
	command: string
	invokeArgs?: Params
	runOnMount?: boolean
	onSuccess?: (data: ApiResult<Return>) => void
	onError?: (error: InvokeError<Return>) => void
	onFinished?: () => void
}

interface UseInvokeReturn<Return, Params extends InvokeArgs = {}> {
	data: ApiResult<Return> | undefined
	isLoading: boolean
	error: InvokeError<Return> | undefined
	execute: (invokeArgs?: Params) => Promise<void>
}

export const useInvoke = <Return, Params extends InvokeArgs = {}>({
	command,
	...args
}: UseInvoke<Return, Params>): UseInvokeReturn<Return, Params> => {
	const [data, setData] = useState<ApiResult<Return> | undefined>(undefined)
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState<InvokeError<Return> | undefined>(undefined)

	const execute = async (invokeArgs?: Params) => {
		setIsLoading(true)
		const finalArgs = args?.invokeArgs ?? invokeArgs ?? {}

		await invoke<ApiResult<Return>>(command, finalArgs)
			.then((data) => {
				setData(data)
				args?.onSuccess?.(data)
			})
			.catch((error: InvokeError<Return>) => {
				const err = errorHandlerType<Return>(error)
				setError(err)
				args?.onError?.(err)
			})
			.finally(() => {
				setIsLoading(false)
				args?.onFinished?.()
			})
	}

	useEffect(() => {
		if (args?.runOnMount) {
			execute(args?.invokeArgs).catch((err) => {
				console.error('Self-calling invoke failed:', err)
			})
		}
	}, [args?.runOnMount, args?.invokeArgs, command])

	return {
		data,
		isLoading,
		error,
		execute,
	}
}

export const errorHandlerType = <Return = never>(error: InvokeError<Return>): ApiResult<Return> => {
	if (typeof error === 'string') {
		return {
			message: error,
			status_code: 500,
			is_success: false,
			data: undefined as never,
		}
	}
	if (error instanceof Error) {
		return {
			message: error.message,
			status_code: 500,
			is_success: false,
			data: undefined as never,
		}
	}
	if (typeof error === 'object' && error !== null && 'message' in error && 'status_code' in error) {
		return error as ApiResult<Return>
	}
	return {
		message: 'Unknown error occurred',
		status_code: 500,
		is_success: false,
		data: undefined as never,
	}
}
