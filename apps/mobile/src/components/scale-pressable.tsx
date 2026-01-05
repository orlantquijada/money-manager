import { useCallback } from "react";
import type { PressableProps } from "react-native";
import {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { TW_TRANSITION_ALL } from "@/utils/motion";
import { AnimatedPressable } from "./animated-pressable";

const DEFAULT_SCALE = 0.95;
const DEFAULT_OPACITY = 1;

export type ScalePressableProps = PressableProps & {
  scaleValue?: number;
  opacityValue?: number;
  disableScale?: boolean;
  disableOpacity?: boolean;
};

export function ScalePressable({
  scaleValue = DEFAULT_SCALE,
  opacityValue = DEFAULT_OPACITY,
  disableScale = false,
  disableOpacity = false,
  onPressIn,
  onPressOut,
  style,
  ...props
}: ScalePressableProps) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const handlePressIn = useCallback(
    (e: Parameters<NonNullable<PressableProps["onPressIn"]>>[0]) => {
      if (!disableScale) {
        scale.value = withTiming(scaleValue, TW_TRANSITION_ALL);
      }
      if (!disableOpacity) {
        opacity.value = withTiming(opacityValue, TW_TRANSITION_ALL);
      }
      onPressIn?.(e);
    },
    [
      scale,
      opacity,
      scaleValue,
      opacityValue,
      disableScale,
      disableOpacity,
      onPressIn,
    ]
  );

  const handlePressOut = useCallback(
    (e: Parameters<NonNullable<PressableProps["onPressOut"]>>[0]) => {
      scale.value = withTiming(1, TW_TRANSITION_ALL);
      opacity.value = withTiming(1, TW_TRANSITION_ALL);
      onPressOut?.(e);
    },
    [scale, opacity, onPressOut]
  );

  return (
    <AnimatedPressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[animatedStyle, style]}
      {...props}
    />
  );
}
