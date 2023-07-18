import { ComponentProps, PropsWithChildren } from "react"
import { View } from "react-native"
import { MotiView } from "moti"
import { styled } from "nativewind"
import clsx from "clsx"

import { transitions } from "~/utils/motion"
import {
  useAnimateHeight,
  UseAnimateProps,
  useMeasureHeight,
} from "~/utils/hooks/useAnimateHeight"

type Props = PropsWithChildren<
  UseAnimateProps & ComponentProps<typeof MotiView>
>

const StyledMotiView = styled(MotiView)
const INITIAL_HEIGHT = 0

export function AnimateHeight(props: Props) {
  const { open, defaultOpen, style, className, children, ...rest } = props

  const { measuredHeight, handleOnLayout } = useMeasureHeight(INITIAL_HEIGHT)
  const { animate } = useAnimateHeight(measuredHeight, { open, defaultOpen })

  return (
    <StyledMotiView
      {...rest}
      animate={animate}
      transition={transitions.snappy}
      className={clsx("overflow-hidden", className)}
      style={style}
    >
      <View
        className="absolute left-0 right-0 bottom-0 top-auto"
        onLayout={handleOnLayout}
      >
        {children}
      </View>
    </StyledMotiView>
  )
}
