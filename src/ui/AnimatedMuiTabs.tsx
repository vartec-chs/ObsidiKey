import { Segment, SegmentedControl } from '@ui/SegmentedControl'
import { AnimatePresence, motion, MotionConfig } from 'framer-motion'

import { useMemo, useState } from 'react'
import { FC, forwardRef, PropsWithChildren } from 'react'
import useMeasure from 'react-use-measure'

import { Box, colors, Paper, PaperProps, styled } from '@mui/material'

// Стили для FormPaper
const FormPaper = styled((props: PaperProps) => <Paper elevation={0} {...props} />)(
	({ theme }) => ({
		borderRadius: theme.shape.borderRadius,
		backgroundColor: theme.palette.mode === 'dark' ? colors.grey[900] : colors.grey[100],
		border: `1px solid ${theme.palette.mode === 'dark' ? colors.grey[800] : colors.grey[200]}`,
		padding: theme.spacing(2),
	}),
)

// Motion-компонент для FormPaper
const BoxComponent = forwardRef<HTMLDivElement, Omit<PaperProps, 'onDrag'>>((props, ref) => (
	<FormPaper {...props} ref={ref as React.Ref<HTMLDivElement>} />
))
const MotionFormBox = motion(BoxComponent)

// Интерфейс для вкладок
interface TabData {
	id: number
	label: string
	content?: React.ReactNode
}

interface AnimatedSegmentedTabsProps {
	tabs: TabData[]
	defaultTab?: number
	isNotContent?: boolean
	className?: string
	onChange?: (activeTab: number) => void
}

// Компонент с вкладками и FormBox
export const AnimatedSegmentedTabs = ({
	tabs,
	defaultTab = 0,
	isNotContent,
	className,
	onChange,
}: AnimatedSegmentedTabsProps) => {
	const [activeTab, setActiveTab] = useState(defaultTab)
	const [direction, setDirection] = useState(0)
	const [isAnimating, setIsAnimating] = useState(false)
	const [ref, bounds] = useMeasure()

	const content = useMemo(() => {
		return tabs.find((tab) => tab.id === activeTab)?.content || null
	}, [activeTab, tabs])

	const handleTabChange = (newTabId: number) => {
		if (newTabId !== activeTab && !isAnimating) {
			const newDirection = newTabId > activeTab ? 1 : -1
			setDirection(newDirection)
			setActiveTab(newTabId)
			onChange?.(newTabId)
		}
	}

	const variants = {
		initial: (direction: number) => ({
			x: 300 * direction,
			opacity: 0,
			filter: 'blur(4px)',
		}),
		active: {
			x: 0,
			opacity: 1,
			filter: 'blur(0px)',
		},
		exit: (direction: number) => ({
			x: -300 * direction,
			opacity: 0,
			filter: 'blur(4px)',
		}),
	}

	console.log('bounds', bounds.height)

	return (
		<Box
			className={className}
			sx={{
				width: '100%',
				height: '100%',
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				gap: 2,
				overflow: 'hidden',
			}}
		>
			<SegmentedControl
				value={activeTab}
				sx={{ width: 'fit-content', height: 'fit-content', position: 'relative' }}
			>
				{tabs.map((tab) => (
					<Segment
						key={tab.id}
						label={tab.label}
						value={tab.id}
						onClick={() => handleTabChange(tab.id)}
						sx={{
							position: 'relative',
							display: 'flex',
							alignItems: 'center',
							'&.Mui-selected': {
								color: 'white',
							},
						}}
					/>
				))}
			</SegmentedControl>

			{!isNotContent && (
				<MotionConfig transition={{ duration: 0.4, type: 'spring', bounce: 0.2 }}>
					<MotionFormBox
						layout
						style={{
							position: 'relative',
							// minWidth: '100%',
							// minHeight: 'fit-content',
							width: '100%',
							height: '100%',
							// display: 'flex',
							// flexDirection: 'column',
							// alignItems: 'center',
							overflow: 'hidden',
							// justifyContent: 'center',
							maxWidth: '400px',
							margin: '0 auto',
						}}
						initial={false}
						animate={{ height: 'fit-content' }}
					>
						<Box ref={ref} width='100%'>
							<AnimatePresence
								custom={direction}
								mode='popLayout'
								presenceAffectsLayout
								anchorX='right'
								onExitComplete={() => setIsAnimating(false)}
							>
								<motion.div
									// style={{  position: 'relative', width: '100%', height: '100%' }}
									key={activeTab}
									variants={variants}
									initial='initial'
									animate='active'
									exit='exit'
									layout
									custom={direction}
									onAnimationStart={() => setIsAnimating(true)}
									onAnimationComplete={() => setIsAnimating(false)}
								>
									{/* <MotionFormBox> */}
									{content}
									{/* </MotionFormBox> */}
								</motion.div>
							</AnimatePresence>
						</Box>
					</MotionFormBox>
				</MotionConfig>
			)}
		</Box>
	)
}
