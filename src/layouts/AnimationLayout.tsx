import { MotionMuiBox, MotionMuiBoxProps } from '@ui/MotionMuiBox'

import { FC } from 'react'
import { Outlet, useLocation } from 'react-router'

import { AnimatePresence } from 'motion/react'

// Вариант 1: Скольжение и масштабирование
const pageVariantsSlideScale: MotionMuiBoxProps['variants'] = {
	initial: {
		opacity: 0,
		x: '100%', // Скольжение справа
		scale: 0.8, // Начальное уменьшение масштаба
	},
	in: {
		opacity: 1,
		x: 0, // Возврат в нормальное положение
		scale: 1, // Нормальный масштаб
	},
	out: {
		opacity: 0,
		x: '-100%', // Скольжение влево при выходе
		scale: 0.8,
	},
}
// Вариант 2: Вращение и затухание
const pageVariantsRotateFade: MotionMuiBoxProps['variants'] = {
	initial: {
		opacity: 0,
		rotateY: 90, // Начальный поворот по оси Y
	},
	in: {
		opacity: 1,
		rotateY: 0, // Возврат к нормальному углу
	},
	out: {
		opacity: 0,
		rotateY: -90, // Поворот в другую сторону при выходе
	},
}
// Вариант 3: Эффект "занавеса" (раскрытие сверху)
const pageVariantsCurtain: MotionMuiBoxProps['variants'] = {
	initial: {
		opacity: 0,
		y: '-100%', // Смещение вверх за пределы экрана
		clipPath: 'inset(100% 0 0 0)', // Начальная обрезка сверху
	},
	in: {
		opacity: 1,
		y: 0, // Возврат в нормальное положение
		clipPath: 'inset(0% 0 0 0)', // Полное раскрытие
	},
	out: {
		opacity: 0,
		y: '100%', // Смещение вниз при выходе
		clipPath: 'inset(0 0 100% 0)', // Обрезка снизу
	},
}
// Вариант 4: Волновой эффект
const pageVariantsWave: MotionMuiBoxProps['variants'] = {
	initial: {
		opacity: 0,
		scale: 0.5, // Уменьшение масштаба
		skewX: 20, // Начальный наклон
		filter: 'blur(4px)', // Начальный размытие
	},
	in: {
		opacity: 1,
		scale: 1, // Нормальный масштаб
		skewX: 0, // Без наклона
		filter: 'blur(0px)', // Без размытия
	},
	out: {
		opacity: 0,
		scale: 1.2, // Увеличение масштаба при выходе
		skewX: -20, // Наклон в другую сторону
		filter: 'blur(4px)', // Начальный размытие
	},
}
// Настройки перехода для всех анимаций
const pageTransition: MotionMuiBoxProps['transition'] = {
	duration: 0.3, // Длительность анимации
	ease: 'easeInOut', // Плавная функция смягчения
	type: 'spring', // Пружинный эффект
	// stiffness: 80, // Жесткость пружины
	// damping:15, // Демпфирование
	// mass: 1, // Масса
	visualDuration: 0.2, // Визуальная длительность
}
// Компонент с выбором анимации
export const AnimationLayout: FC = () => {
	const { pathname } = useLocation()
	const isDisabled = false
	if (isDisabled) return <Outlet />
	// Можно выбрать разные варианты анимации в зависимости от условий
	const selectedVariants = pageVariantsCurtain // Замените на другие варианты для теста
	return (
		<AnimatePresence mode='wait' key={pathname}>
			<MotionMuiBox
				width='100%'
				height='100%'
				layout
				padding={0}
				margin={0}
				initial='initial'
				animate='in'
				exit='out'
				variants={selectedVariants}
				transition={pageTransition}
			>
				<Outlet />
			</MotionMuiBox>
		</AnimatePresence>
	)
}

// import { MotionMuiBox, MotionMuiBoxProps } from '@ui/MotionMuiBox'
// import { AnimatePresence } from 'framer-motion'

// import { FC, useEffect, useRef } from 'react'
// import { Outlet, useLocation } from 'react-router'

// // Варианты анимации в зависимости от направления
// const pageVariants: MotionMuiBoxProps['variants'] = {
// 	initial: (direction: number) => ({
// 		opacity: 0,
// 		x: direction > 0 ? '100%' : '-100%', // Вперед: слайд справа, назад: слайд слева
// 		scale: 0.95,
// 	}),
// 	in: {
// 		opacity: 1,
// 		x: 0,
// 		scale: 1,
// 	},
// 	out: (direction: number) => ({
// 		opacity: 0,
// 		x: direction > 0 ? '-100%' : '100%', // Вперед: уход влево, назад: уход вправо
// 		scale: 0.95,
// 	}),
// }

// // Настройки перехода
// const pageTransition: MotionMuiBoxProps['transition'] = {
// 	duration: 0.5,
// 	ease: 'easeInOut',
// 	type: 'spring',
// 	stiffness: 100,
// 	damping: 15,
// }

// // Компонент для управления анимацией маршрутов
// export const AnimationLayout: FC = () => {
// 	const { pathname } = useLocation()
// 	const historyStack = useRef<string[]>([]) // Стек истории маршрутов
// 	const directionRef = useRef<number>(0) // Направление: 1 (вперед), -1 (назад), 0 (начальное)

// 	// Отслеживание истории и определение направления
// 	useEffect(() => {
// 		const currentStack = historyStack.current

// 		// Проверяем, является ли текущий маршрут возвратом назад
// 		if (currentStack.length > 1 && currentStack[currentStack.length - 2] === pathname) {
// 			// Назад: удаляем последний маршрут из стека
// 			historyStack.current = currentStack.slice(0, -1)
// 			directionRef.current = -1 // Анимация назад
// 		} else {
// 			// Вперед: добавляем новый маршрут в стек
// 			historyStack.current = [...currentStack, pathname]
// 			directionRef.current = 1 // Анимация вперед
// 		}
// 	}, [pathname])

// 	const isDisabled = false

// 	if (isDisabled) return <Outlet />

// 	return (
// 		<AnimatePresence mode='wait' initial={false} custom={directionRef.current}>
// 			<MotionMuiBox
// 				sx={{ width: '100%', height: '100%', padding: 0, margin: 0 }}
// 				key={pathname}
// 				custom={directionRef.current} // Передаем направление для variants
// 				initial='initial'
// 				animate='in'
// 				exit='out'
// 				variants={pageVariants}
// 				transition={pageTransition}
// 			>
// 				<Outlet />
// 			</MotionMuiBox>
// 		</AnimatePresence>
// 	)
// }
