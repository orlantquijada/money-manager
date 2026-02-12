import { useCallback } from "react";
import type { PressableProps } from "react-native";
import {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { transitions } from "@/utils/motion";
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
        scale.value = withSpring(scaleValue, transitions.snappier);
      }
      if (!disableOpacity) {
        opacity.value = withSpring(opacityValue, transitions.snappier);
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
      scale.value = withSpring(1, transitions.snappier);
      opacity.value = withSpring(1, transitions.snappier);
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
