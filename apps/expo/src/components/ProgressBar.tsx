import { ComponentProps, ReactNode } from "react"
import { ColorValue, View } from "react-native"
import { MotiView } from "moti"
import clsx from "clsx"

import { violet } from "~/utils/colors"

const duration = 550

type ProgressBarProps = {
  /*
   * percentage value so it should be 0-100
   * NOTE: value is clamped
   */
  progress: number
  Stripes: ReactNode
  color?: ColorValue | undefined
  highlight?: boolean
  delayMultiplier?: number
} & ComponentProps<typeof View>

export default function ProgressBar({
  progress: progressProp,
  className,
  Stripes,
  color = violet.violet6,
  highlight,
  style,
  delayMultiplier = 0,
  ...props
}: ProgressBarProps) {
  return (
    <View
      {...props}
      style={[{ borderColor: highlight ? color : "transparent" }, style]}
      className={clsx(
        "relative h-2 w-full rounded-full",
        highlight && "border",
        className,
      )}
    >
      <View className="absolute inset-0 overflow-hidden rounded-full">
        <View className="absolute inset-0">{Stripes}</View>
      </View>

      {highlight && (
        <View
          className="absolute -bottom-2 h-1 w-1 self-center rounded-full"
          style={{ backgroundColor: color }}
        />
      )}

      {/* thumb */}
      <View className="absolute inset-0 overflow-hidden rounded-full">
        <MotiView
          animate={{ left: `-${100 - progressProp}%` }}
          delay={duration * delayMultiplier}
          transition={{ type: "timing", duration }}
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
        />
      </View>
    </View>
  )
}
