import { ComponentProps, PropsWithChildren } from "react"
import { View } from "react-native"
import { MotiView } from "moti"

import { transitions } from "~/utils/motion"
import {
  useAnimateHeight,
  UseAnimateProps,
  useMeasureHeight,
} from "~/utils/hooks/useAnimateHeight"

type Props = PropsWithChildren<
  UseAnimateProps & ComponentProps<typeof MotiView>
>

const INITIAL_HEIGHT = 0

// NOTE: tried using react state to handle `open`
// but the delay while toggling is really noticeable
// and is just bad for UX, especially when the animations are interrupted
export function AnimateHeight(props: Props) {
  const { open, defaultOpen, children, ...rest } = props

  const { measuredHeight, handleOnLayout } = useMeasureHeight(INITIAL_HEIGHT)
  const { animate } = useAnimateHeight(measuredHeight, { open, defaultOpen })

  return (
    <MotiView
      {...rest}
      className="overflow-hidden"
      animate={animate}
      transition={transitions.snappy}
    >
      <View
        className="absolute left-0 right-0 bottom-0 top-auto"
        onLayout={handleOnLayout}
      >
        {children}
      </View>
    </MotiView>
  )
}
