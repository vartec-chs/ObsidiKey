import React from 'react'
import { ComponentProps } from 'react'

import MuiStack, { StackProps } from '@mui/material/Stack'

import { motion } from 'motion/react'

const StackComponent = React.forwardRef<HTMLDivElement, Omit<StackProps, 'onDrag'>>(
	(props, ref) => <MuiStack {...props} ref={ref as React.Ref<HTMLDivElement>} />,
)

export const MotionMuiStack = motion(StackComponent)

export type MotionMuiStackProps = ComponentProps<typeof MotionMuiStack>
