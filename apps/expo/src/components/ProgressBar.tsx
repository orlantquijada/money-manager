import clsx from "clsx"
import { ComponentProps, ReactNode } from "react"
import { useDerivedValue, useSharedValue } from "react-native-reanimated"
import { useDynamicAnimation } from "moti"
import { ColorValue } from "react-native"

import { clamp } from "~/utils/functions"
import { transitions } from "~/utils/motion"

import StyledMotiView from "./StyledMotiView"
import { violet } from "~/utils/colors"

type ProgressBarProps = {
  /*
   * percentage value so it should be 0-100
   * NOTE: value is clamped
   */
  progress: number
  Stripes: ReactNode
  color?: ColorValue
} & ComponentProps<typeof StyledMotiView>

// TODO: handle negative progress
export default function ProgressBar({
  progress: progressProp,
  className,
  Stripes,
  color = violet.violet6,
  ...props
}: ProgressBarProps) {
  const fullWidth = useSharedValue(0)
  const state = useDynamicAnimation()

  useDerivedValue(() => {
    const clampedProgress = clamp(progressProp, 0, 100)
    state.animateTo({
      translateX: -(
        fullWidth.value -
        fullWidth.value * (clampedProgress / 100)
      ),
    })
  }, [progressProp])

  return (
    <StyledMotiView
      {...props}
      className={clsx(
        "relative h-2 w-full overflow-hidden rounded-full",
        className,
      )}
      onLayout={(e) => {
        fullWidth.value = e.nativeEvent.layout.width
        props.onLayout?.(e)
      }}
    >
      <StyledMotiView className="absolute inset-0">{Stripes}</StyledMotiView>

      {/* thumb */}
      <StyledMotiView
        state={state}
        transition={transitions.soft}
        className="bg-violet6 h-full rounded-full"
        style={{ backgroundColor: color }}
      />
    </StyledMotiView>
  )
}
