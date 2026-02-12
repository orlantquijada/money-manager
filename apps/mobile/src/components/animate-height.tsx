import { type ReactNode, useCallback } from "react";
import { type LayoutChangeEvent, StyleSheet } from "react-native";
import Animated, {
  type SharedValue,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { StyledLeanView } from "@/config/interop";
import { transitions } from "@/utils/motion";

type Props = {
  isExpanded: SharedValue<boolean>;
  children: ReactNode;
  /**
   * Optional pre-calculated height. When provided, skips onLayout measurement
   * for better performance (no layout pass before animation starts).
   */
  height?: number;
};

export default function AnimateHeight({ isExpanded, children, height }: Props) {
  const { handleOnLayout, measuredHeight } = useMeasureHeight(height ?? 0);
  const isHeightKnown = height !== undefined;

  // Single spring driving all properties — 1 calculation per frame instead of 4
  const progress = useDerivedValue(() =>
    withSpring(isExpanded.get() ? 1 : 0, transitions.snappy)
  );

  const bodyStyle = useAnimatedStyle(() => {
    const p = progress.get();
    const targetHeight = isHeightKnown ? height : measuredHeight.get();
    return {
      height: targetHeight * p,
      opacity: p,
      transform: [
        { scale: 0.9 + 0.1 * p }, // 0.9 → 1
        { translateY: -25 * (1 - p) }, // -25 → 0
      ],
    };
  });

  return (
    <Animated.View className="w-full overflow-hidden" style={bodyStyle}>
      <StyledLeanView
        // Only attach onLayout when we need to measure
        onLayout={isHeightKnown ? undefined : handleOnLayout}
        style={{ ...StyleSheet.absoluteFillObject, bottom: "auto" }}
      >
        {children}
      </StyledLeanView>
    </Animated.View>
  );
}

export function useMeasureHeight(initialHeight = 0) {
  const measuredHeight = useSharedValue(initialHeight);
  const handleOnLayout = useCallback(
    ({ nativeEvent }: LayoutChangeEvent) => {
      const newHeight = nativeEvent.layout.height;
      // Only update if height actually changed to avoid unnecessary recalculations
      if (measuredHeight.value !== newHeight) {
        measuredHeight.value = newHeight;
      }
    },
    [measuredHeight]
  );

  return { measuredHeight, handleOnLayout } as const;
}
