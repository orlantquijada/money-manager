import { StyleSheet } from "react-native";
import { StyledLeanView } from "@/config/interop";
import { cn } from "@/utils/cn";
import { clamp } from "@/utils/math";
import { useThemeColor } from "../theme-provider";

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
  const color = useThemeColor("accent");

  return (
    <StyledLeanView
      className={cn("h-2 grow rounded-full")}
      style={{
        borderCurve: "continuous",
        borderColor: color,
        borderWidth: highlight ? 1 : StyleSheet.hairlineWidth,
      }}
    >
      <StyledLeanView
        className="absolute inset-0 overflow-hidden rounded-full bg-muted"
        style={{ borderCurve: "continuous" }}
      />

      {highlight && (
        <StyledLeanView
          className="absolute -bottom-2 h-1 w-1 self-center rounded-full"
          style={{ backgroundColor: color }}
        />
      )}

      {/* Thumb */}
      <StyledLeanView
        className="absolute inset-0 overflow-hidden rounded-full"
        style={{ borderCurve: "continuous" }}
      >
        <StyledLeanView
          className="h-full w-full rounded-full"
          style={{
            borderCurve: "continuous",
            backgroundColor: color,
            transform: [{ translateX: `${(clampedProgress - 1) * 100}%` }],
          }}
        />
      </StyledLeanView>
    </StyledLeanView>
  );
}
