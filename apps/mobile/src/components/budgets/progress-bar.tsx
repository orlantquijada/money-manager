import { useEffect } from "react";
import type { ViewProps } from "react-native";
import Animated, {
  type AnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { StyledLeanView } from "@/config/interop";
import { cn } from "@/utils/cn";
import { clamp } from "@/utils/math";
import { transitions } from "@/utils/motion";

const AnimatedStyledLeanView = Animated.createAnimatedComponent(StyledLeanView);

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
} & AnimatedProps<ViewProps>;

export default function ProgressBar({
  flex = 1,
  highlight,
  progress = 1,
  colorVariant = "spending",
  style,
  ...props
}: Props) {
  const clampedProgress = clamp(progress, 0, 1);
  const { bg, border } = colorSlots[colorVariant];
  const progressSV = useSharedValue(clampedProgress);

  useEffect(() => {
    progressSV.value = withSpring(clampedProgress, transitions.soft);
  }, [clampedProgress, progressSV]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${progressSV.value * 100}%`,
  }));

  return (
    <AnimatedStyledLeanView
      className={cn("h-1.5 shrink-0 rounded-full border-hairline", border)}
      style={[
        {
          flex,
          borderCurve: "continuous",
        },
        style,
      ]}
      {...props}
    >
      <StyledLeanView
        className="absolute inset-0 overflow-hidden rounded-full bg-muted/50"
        style={{ borderCurve: "continuous" }}
      />

      {highlight && (
        <StyledLeanView
          className={cn(
            "absolute -bottom-2 h-1 w-1 self-center rounded-full",
            bg
          )}
        />
      )}

      <StyledLeanView
        className="absolute inset-0 overflow-hidden rounded-full"
        style={{ borderCurve: "continuous" }}
      >
        <AnimatedStyledLeanView
          className={cn("h-full rounded-full", bg)}
          style={[
            {
              borderCurve: "continuous",
            },
            animatedStyle,
          ]}
        />
      </StyledLeanView>
    </AnimatedStyledLeanView>
  );
}
