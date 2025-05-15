import { logger } from '@/config/main'

import { useCallback, useEffect, useRef, useState } from 'react'

import { invoke } from '@tauri-apps/api/core'

type ApiResult<T = unknown> = {
	data: T
	message: string
	statusCode: number
	isSuccess: boolean
}

type InvokeArgs = {
	[key: string]: any
}

type InvokeError<T = unknown> = ApiResult<T>

export type BaseInvokeOptions<Return> = {
	runOnMount?: boolean
	onSuccess?: (data: ApiResult<Return>) => void
	onError?: (error: InvokeError<Return>) => void
	onFinished?: () => void
}

interface UseInvokeOptions<Return, Params extends InvokeArgs = {}>
	extends BaseInvokeOptions<Return> {
	command: string
	invokeArgs?: Params
	enabled?: boolean
	timeout?: number
}

interface UseInvokeReturn<Return, Params extends InvokeArgs = {}> {
	data: ApiResult<Return> | undefined
	isLoading: boolean
	error: InvokeError<Return> | undefined
	execute: (invokeArgs?: Params) => Promise<ApiResult<Return>>
	cancel: () => void
}

export const useInvoke = <Return, Params extends InvokeArgs = {}>({
	command,
	invokeArgs: defaultInvokeArgs,
	runOnMount = false,
	onSuccess,
	onError,
	onFinished,
	enabled = true,
	timeout,
}: UseInvokeOptions<Return, Params>): UseInvokeReturn<Return, Params> => {
	const [data, setData] = useState<ApiResult<Return> | undefined>(undefined)
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState<InvokeError<Return> | undefined>(undefined)
	const abortControllerRef = useRef<AbortController | null>(null)

	const execute = useCallback(
		async (invokeArgs?: Params): Promise<ApiResult<Return>> => {
			setIsLoading(true)
			setError(undefined)
			const finalArgs = invokeArgs ?? defaultInvokeArgs ?? {}
			abortControllerRef.current = new AbortController()

			try {
				const result = await Promise.race([
					invoke<ApiResult<Return>>(command, finalArgs),
					...(timeout
						? [
								new Promise<never>((_, reject) =>
									setTimeout(() => reject(new Error('Timeout')), timeout),
								),
							]
						: []),
				])
				setData(result)
				onSuccess?.(result)
				return result
			} catch (err) {
				const error = errorHandlerType<Return>(err)
				setError(error)
				onError?.(error)
				throw error
			} finally {
				setIsLoading(false)
				onFinished?.()
				abortControllerRef.current = null
			}
		},
		[command, defaultInvokeArgs, onSuccess, onError, onFinished, timeout],
	)

	const cancel = useCallback(() => {
		if (abortControllerRef.current) {
			abortControllerRef.current.abort()
		}
	}, [])

	useEffect(() => {
		if (runOnMount && enabled) {
			execute().catch((err) => {
				console.error('Self-calling invoke failed:', err)
			})
		}
		return () => {
			cancel()
		}
	}, [runOnMount, enabled, execute, cancel])

	return {
		data,
		isLoading,
		error,
		execute,
		cancel,
	}
}

export const errorHandlerType = <Return = never>(error: unknown): InvokeError<Return> => {
	logger.error(`Error: ${JSON.stringify(error)}`)
	if (typeof error === 'string') {
		return {
			message: error,
			statusCode: 500,
			isSuccess: false,
			data: undefined as never,
		}
	}
	if (error instanceof Error) {
		return {
			message: error.message,
			statusCode: 500,
			isSuccess: false,
			data: undefined as never,
		}
	}
	if (typeof error === 'object' && error !== null && 'message' in error && 'statusCode' in error) {
		return error as ApiResult<Return>
	}
	return {
		message: 'Unknown error occurred',
		statusCode: 500,
		isSuccess: false,
		data: undefined as never,
	}
}
