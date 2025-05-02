import { useEffect, useRef, useState } from 'react'

import { getCurrentWindow, PhysicalSize } from '@tauri-apps/api/window'

type MatchesCondition = (size: { width: number; height: number }) => boolean
type OnResizeCallback = (size: PhysicalSize) => void

export type ResizeCondition<ID extends string = string> = {
	id: ID
	match: MatchesCondition
	onResize?: OnResizeCallback
}

type UseWindowResizeOptions<T extends string> = {
	onResize?: OnResizeCallback
	matches?: ResizeCondition<T>[]
	debounce?: number
	throttle?: number
	leading?: boolean
}

export type MatchMap<T extends string> = Record<T, boolean>

export const useWindowResize = <T extends string = string>({
	onResize,
	matches = [],
	debounce,
	throttle,
	leading = false,
}: UseWindowResizeOptions<T>) => {
	const [size, setSize] = useState<{ width: number; height: number }>({ width: 0, height: 0 })
	const [matchedConditions, setMatchedConditions] = useState<boolean[]>([])
	const [matchMap, setMatchMap] = useState<MatchMap<T>>({} as MatchMap<T>)

	const prevMatchMapRef = useRef<MatchMap<T>>({} as MatchMap<T>)
	const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
	const lastCallRef = useRef<number>(0)
	const hasCalledLeadingRef = useRef<boolean>(false)

	const memoizedMatchesRef = useRef(matches)
	useEffect(() => {
		memoizedMatchesRef.current = matches
	}, [matches])

	const executeResize = (newSize: PhysicalSize) => {
		const { width, height } = newSize

		const newMatchArray: boolean[] = []
		const newMatchMap = {} as MatchMap<T>

		let hasChanged = false
		let sizeChanged = size.width !== width || size.height !== height

		for (const condition of memoizedMatchesRef.current) {
			const key = condition.id as T // 👈 явно указываем тип
			const result = condition.match({ width, height })

			newMatchArray.push(result)
			newMatchMap[key] = result

			if (prevMatchMapRef.current[key] !== result) {
				hasChanged = true
			}

			if (result && condition.onResize) {
				condition.onResize(newSize)
			}
		}

		if (sizeChanged) {
			setSize({ width, height })
		}

		if (hasChanged) {
			setMatchedConditions(newMatchArray)
			setMatchMap(newMatchMap)
			prevMatchMapRef.current = newMatchMap
		}

		if ((sizeChanged || hasChanged) && onResize) {
			onResize(newSize)
		}
	}

	const handleResize = (newSize: PhysicalSize) => {
		const now = Date.now()

		if (debounce !== undefined) {
			if (timeoutRef.current) clearTimeout(timeoutRef.current)

			const callImmediately = leading && !hasCalledLeadingRef.current

			if (callImmediately) {
				executeResize(newSize)
				hasCalledLeadingRef.current = true
			}

			timeoutRef.current = setTimeout(() => {
				if (!callImmediately) {
					executeResize(newSize)
				}
				hasCalledLeadingRef.current = false
			}, debounce)
		} else if (throttle !== undefined) {
			const elapsed = now - lastCallRef.current

			if (leading && lastCallRef.current === 0) {
				lastCallRef.current = now
				executeResize(newSize)
			} else if (elapsed >= throttle) {
				lastCallRef.current = now
				executeResize(newSize)
			}
		} else {
			executeResize(newSize)
		}
	}

	useEffect(() => {
		let unlisten: () => void

		const updateSize = async () => {
			const window = getCurrentWindow()
			const currentSize = await window.innerSize()
			handleResize(currentSize)
		}

		const setupListener = async () => {
			unlisten = await getCurrentWindow().onResized(({ payload }) => {
				handleResize(payload)
			})
		}

		updateSize()
		setupListener()

		return () => {
			if (unlisten) unlisten()
			if (timeoutRef.current) clearTimeout(timeoutRef.current)
			hasCalledLeadingRef.current = false
			lastCallRef.current = 0
		}
	}, [onResize, debounce, throttle, leading])

	return {
		width: size.width,
		height: size.height,
		matches: matchedConditions,
		matchMap,
	}
}
