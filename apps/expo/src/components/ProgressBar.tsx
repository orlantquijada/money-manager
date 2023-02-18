import clsx from "clsx"
import { ComponentProps, FC } from "react"
import { SvgProps } from "react-native-svg"
import { useDerivedValue, useSharedValue } from "react-native-reanimated"
import { useDynamicAnimation } from "moti"

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
  Stripes: FC<SvgProps>
  color: keyof typeof violet
} & ComponentProps<typeof StyledMotiView>

export default function ProgressBar({
  progress: progressProp,
  className,
  Stripes,
  color,
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
      // translateX: fullWidth.value * (clampedProgress / 100),
      // translateX: 0,
    })
  }, [progressProp])

  return (
    <StyledMotiView
      {...props}
      className={clsx("relative h-2 w-full overflow-hidden", className)}
      // style={{ backgroundColor: violet[color] }}
      //
      onLayout={(e) => {
        fullWidth.value = e.nativeEvent.layout.width
        props.onLayout?.(e)
      }}
    >
      <StyledMotiView
        // className="bg-mauve3 absolute inset-0"
        className="bg-violet6 absolute inset-0 opacity-30"
      >
        <Stripes />
      </StyledMotiView>

      {/* thumb */}
      <StyledMotiView
        state={state}
        transition={transitions.soft}
        className="bg-violet6 h-full rounded-full"
      >
        {/* <Text>asd</Text> */}
      </StyledMotiView>
    </StyledMotiView>
  )
}
