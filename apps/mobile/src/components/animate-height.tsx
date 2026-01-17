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
  top?: boolean;
};

export default function AnimateHeight({ isExpanded, children }: Props) {
  const { handleOnLayout, measuredHeight } = useMeasureHeight();

  // Single spring driving all properties — 1 calculation per frame instead of 4
  const progress = useDerivedValue(() =>
    withSpring(isExpanded.get() ? 1 : 0, transitions.snappy)
  );

  const bodyStyle = useAnimatedStyle(() => {
    const p = progress.get();
    return {
      height: measuredHeight.get() * p,
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
        onLayout={handleOnLayout}
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
