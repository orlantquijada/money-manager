import { StyleSheet } from "react-native";
import { cn } from "@/utils/cn";
import { violet, violetDark } from "@/utils/colors";
import { clamp } from "@/utils/math";
import LeanView from "../lean-view";
import { useTheme } from "../theme-provider";

type Props = {
  barWidth: number;
  highlight?: boolean;
  /** Progress value from 0 to 1 */
  progress?: number;
  color?: string;
};

export default function ProgressBar({
  barWidth: _barWidth,
  highlight,
  progress = 1,
  // color = violet.violet6,
}: Props) {
  const clampedProgress = clamp(progress, 0, 1);
  const { isDark } = useTheme();

  const color = isDark ? violetDark.violetDark8 : violet.violet6;

  return (
    <LeanView
      className={cn("h-2 flex-grow rounded-full")}
      style={{
        borderCurve: "continuous",
        borderColor: color,
        borderWidth: highlight ? 1 : StyleSheet.hairlineWidth,
      }}
    >
      <LeanView
        className="absolute inset-0 overflow-hidden rounded-full bg-muted"
        style={{ borderCurve: "continuous" }}
      />

      {highlight && (
        <LeanView
          className="absolute -bottom-2 h-1 w-1 self-center rounded-full"
          style={{ backgroundColor: color }}
        />
      )}

      {/* Thumb */}
      <LeanView
        className="absolute inset-0 overflow-hidden rounded-full"
        style={{ borderCurve: "continuous" }}
      >
        <LeanView
          className="h-full w-full rounded-full"
          style={{
            borderCurve: "continuous",
            backgroundColor: color,
            transform: [{ translateX: `${(clampedProgress - 1) * 100}%` }],
          }}
        />
      </LeanView>
    </LeanView>
  );
}
