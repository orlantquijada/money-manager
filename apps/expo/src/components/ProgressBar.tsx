import clsx from "clsx"
import { ComponentProps, FC } from "react"
import { SvgProps } from "react-native-svg"
import { useDerivedValue, useSharedValue } from "react-native-reanimated"
import { useDynamicAnimation } from "moti"

import { clamp } from "~/utils/functions"
import { transitions } from "~/utils/motion"

import StyledMotiView from "./StyledMotiView"

type ProgressBarProps = {
  /*
   * percentage value so it should be 0-100
   * NOTE: value is clamped
   */
  progress: number
  Stripes: FC<SvgProps>
} & ComponentProps<typeof StyledMotiView>

export default function ProgressBar({
  progress: progressProp,
  className,
  Stripes,
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
      className={clsx("relative h-2 w-full overflow-hidden", className)}
      onLayout={(e) => {
        fullWidth.value = e.nativeEvent.layout.width
        props.onLayout?.(e)
      }}
    >
      <StyledMotiView className="absolute inset-0 opacity-[.15]">
        <Stripes />
      </StyledMotiView>

      {/* thumb */}
      <StyledMotiView
        state={state}
        transition={transitions.soft}
        className="bg-violet6 h-full rounded-full"
      />
    </StyledMotiView>
  )
}
