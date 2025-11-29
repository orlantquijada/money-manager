import clsx from "clsx";
import { MotiView } from "moti";
import type { ComponentProps, ReactNode } from "react";
import { type ColorValue, View } from "react-native";

import { violet } from "~/utils/colors";

const duration = 550;

type ProgressBarProps = {
  /*
   * percentage value so it should be 0-100
   * NOTE: value is clamped
   */
  progress: number;
  Stripes: ReactNode;
  color?: ColorValue | undefined;
  highlight?: boolean;
  delayMultiplier?: number;
} & ComponentProps<typeof View>;

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
      className={clsx(
        "relative h-2 w-full rounded-full",
        highlight && "border",
        className
      )}
      style={[{ borderColor: highlight ? color : "transparent" }, style]}
    >
      <View className="absolute inset-0 overflow-hidden rounded-full">
        <View className="absolute inset-0">{Stripes}</View>
      </View>

      {highlight && (
        <View
          className="-bottom-2 absolute h-1 w-1 self-center rounded-full"
          style={{ backgroundColor: color }}
        />
      )}

      {/* thumb */}
      <View className="absolute inset-0 overflow-hidden rounded-full">
        <MotiView
          animate={{ left: `-${100 - progressProp}%` }}
          className="h-full rounded-full"
          delay={duration * delayMultiplier}
          style={{ backgroundColor: color }}
          transition={{ type: "timing", duration }}
        />
      </View>
    </View>
  );
}
