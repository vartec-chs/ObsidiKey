import { Segment, SegmentedControl } from '@ui/SegmentedControl'
import { AnimatePresence, motion, MotionConfig } from 'framer-motion'

import { useMemo, useState } from 'react'
import useMeasure from 'react-use-measure'

import { Box } from '@mui/material'

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

export const AnimatedMuiTabs2 = ({
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

	const handleTabChange = (event: React.SyntheticEvent, newTabId: number) => {
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

	return (
		<Box className={className} sx={{ width: '100%' }}>
			<SegmentedControl value={activeTab} onChange={handleTabChange} sx={{ width: 'fit-content' }}>
				{tabs.map((tab) => (
					<Segment
						key={tab.id}
						label={tab.label}
						value={tab.id}
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
					<motion.div
						style={{ width: '100%', overflow: 'hidden' }}
						initial={false}
						animate={{ height: bounds.height }}
					>
						<Box ref={ref} sx={{ p: 1 }}>
							<AnimatePresence
								custom={direction}
								mode='popLayout'
								onExitComplete={() => setIsAnimating(false)}
							>
								<motion.div
									key={activeTab}
									variants={variants}
									initial='initial'
									animate='active'
									exit='exit'
									custom={direction}
									onAnimationStart={() => setIsAnimating(true)}
									onAnimationComplete={() => setIsAnimating(false)}
								>
									{content}
								</motion.div>
							</AnimatePresence>
						</Box>
					</motion.div>
				</MotionConfig>
			)}
		</Box>
	)
}
