import clsx from "clsx"
import { ComponentProps, ReactNode } from "react"
import { ColorValue, View } from "react-native"

import { clamp } from "~/utils/functions"
import { transitions } from "~/utils/motion"

import StyledMotiView from "./StyledMotiView"
import { violet } from "~/utils/colors"
import { useMeasureWidth } from "~/utils/hooks/useAnimateHeight"

type ProgressBarProps = {
  /*
   * percentage value so it should be 0-100
   * NOTE: value is clamped
   */
  progress: number
  Stripes: ReactNode
  color?: ColorValue
  highlight?: boolean
} & ComponentProps<typeof StyledMotiView>

// TODO: handle negative progress
export default function ProgressBar({
  progress: progressProp,
  className,
  Stripes,
  color = violet.violet6,
  highlight,
  style,
  ...props
}: ProgressBarProps) {
  const { measuredWidth: fullWidth, handleOnLayout } = useMeasureWidth(0)

  return (
    <StyledMotiView
      {...props}
      style={[{ borderColor: highlight ? color : "transparent" }, style]}
      className={clsx(
        "relative h-2 w-full rounded-full",
        highlight && "border",
        className,
      )}
      onLayout={handleOnLayout}
    >
      <View className="absolute inset-0 overflow-hidden">
        <StyledMotiView className="absolute inset-0">{Stripes}</StyledMotiView>
      </View>

      {highlight && (
        <View
          className="absolute -bottom-2 h-1 w-1 self-center rounded-full"
          style={{ backgroundColor: color }}
        />
      )}

      {/* thumb */}
      <View className="absolute inset-0 overflow-hidden rounded-full">
        <StyledMotiView
          animate={{
            translateX: -(
              fullWidth.value -
              fullWidth.value * (clamp(progressProp, 0, 100) / 100)
            ),
          }}
          // slight delay to wait for
          delay={350}
          transition={transitions.soft}
          className="bg-violet6 h-full rounded-full"
          style={{ backgroundColor: color }}
        />
      </View>
    </StyledMotiView>
  )
}
