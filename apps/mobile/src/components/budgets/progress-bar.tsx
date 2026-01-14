import { StyleSheet } from "react-native";
import { StyledLeanView } from "@/config/interop";
import { clamp } from "@/utils/math";

type ColorVariant = "spending" | "non-negotiable" | "destructive";

/** Maps color variant to { bg, border } Tailwind classes */
const colorSlots: Record<ColorVariant, { bg: string; border: string }> = {
  spending: {
    bg: "bg-progress-spending",
    border: "border-progress-spending",
  },
  "non-negotiable": {
    bg: "bg-progress-non-negotiable",
    border: "border-progress-non-negotiable",
  },
  destructive: {
    bg: "bg-destructive",
    border: "border-destructive",
  },
};

type Props = {
  /** Flex value for proportional width (default: 1) */
  flex?: number;
  highlight?: boolean;
  /** Progress value from 0 to 1 */
  progress?: number;
  colorVariant?: ColorVariant;
};

export default function ProgressBar({
  flex = 1,
  highlight,
  progress = 1,
  colorVariant = "spending",
}: Props) {
  const clampedProgress = clamp(progress, 0, 1);
  const { bg, border } = colorSlots[colorVariant];

  return (
    <StyledLeanView
      className={`h-2 shrink-0 rounded-full ${border}`}
      style={{
        flex,
        borderCurve: "continuous",
        borderWidth: highlight ? 1 : StyleSheet.hairlineWidth,
      }}
    >
      <StyledLeanView
        className="absolute inset-0 overflow-hidden rounded-full bg-muted"
        style={{ borderCurve: "continuous" }}
      />

      {highlight && (
        <StyledLeanView
          className={`absolute -bottom-2 h-1 w-1 self-center rounded-full ${bg}`}
        />
      )}

      <StyledLeanView
        className="absolute inset-0 overflow-hidden rounded-full"
        style={{ borderCurve: "continuous" }}
      >
        <StyledLeanView
          className={`h-full rounded-full ${bg}`}
          style={{
            borderCurve: "continuous",
            width: `${clampedProgress * 100}%`,
          }}
        />
      </StyledLeanView>
    </StyledLeanView>
  );
}
