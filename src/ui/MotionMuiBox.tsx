import React from 'react'
import { ComponentProps } from 'react'

import MuiBox, { BoxProps } from '@mui/material/Box'

import { motion } from 'motion/react'

const BoxComponent = React.forwardRef<HTMLDivElement, Omit<BoxProps, 'onDrag'>>((props, ref) => (
	<MuiBox {...props} ref={ref as React.Ref<HTMLDivElement>} />
))

export const MotionMuiBox = motion(BoxComponent)

export type MotionMuiBoxProps = ComponentProps<typeof MotionMuiBox>
