import { StyleSheet } from "react-native";
import { StyledLeanView } from "@/config/interop";
import { clamp } from "@/utils/math";
import { useThemeColor } from "../theme-provider";

type Props = {
  /** Flex value for proportional width (default: 1) */
  flex?: number;
  highlight?: boolean;
  /** Progress value from 0 to 1 */
  progress?: number;
  color?: string;
};

export default function ProgressBar({
  flex = 1,
  highlight,
  progress = 1,
  color,
}: Props) {
  const clampedProgress = clamp(progress, 0, 1);
  const primaryColor = useThemeColor("violet-6");
  const finalColor = color ?? primaryColor;

  return (
    <StyledLeanView
      className="h-2 shrink-0 rounded-full border-lime-9"
      style={{
        flex,
        borderCurve: "continuous",
        borderColor: finalColor,
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
          style={{ backgroundColor: finalColor }}
        />
      )}

      <StyledLeanView
        className="absolute inset-0 overflow-hidden rounded-full"
        style={{ borderCurve: "continuous" }}
      >
        <StyledLeanView
          className="h-full rounded-full"
          style={{
            borderCurve: "continuous",
            backgroundColor: finalColor,
            width: `${clampedProgress * 100}%`,
          }}
        />
      </StyledLeanView>
    </StyledLeanView>
  );
}
