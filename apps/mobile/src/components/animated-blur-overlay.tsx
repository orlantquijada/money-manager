import type { MaterialTopTabBarProps } from "@react-navigation/material-top-tabs";
import { BlurView } from "expo-blur";
import { useMemo } from "react";
import { Animated, StyleSheet } from "react-native";

type AnimatedBlurOverlayProps = {
  position: MaterialTopTabBarProps["position"];
  routes: MaterialTopTabBarProps["state"]["routes"];
};

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

/**
 * A blur overlay that animates based on tab swipe position.
 * The blur is only visible during transitions (between tabs), not when settled on a tab.
 */
export function AnimatedBlurOverlay({
  position,
  routes,
}: AnimatedBlurOverlayProps) {
  // Create an input range with midpoints between each tab
  // e.g., for 3 tabs: [0, 0.5, 1, 1.5, 2]
  const { inputRange, outputRange } = useMemo(() => {
    const inputs: number[] = [];
    const outputs: number[] = [];

    for (let i = 0; i < routes.length; i++) {
      // At each tab position: no blur
      inputs.push(i);
      outputs.push(0);

      // At midpoint between tabs: full blur
      if (i < routes.length - 1) {
        inputs.push(i + 0.5);
        outputs.push(1);
      }
    }

    return { inputRange: inputs, outputRange: outputs };
  }, [routes.length]);

  const opacity = useMemo(
    () =>
      position.interpolate({
        inputRange,
        outputRange,
      }),
    [position, inputRange, outputRange]
  );

  return (
    <AnimatedBlurView
      experimentalBlurMethod="dimezisBlurView"
      intensity={15}
      pointerEvents="none"
      style={[StyleSheet.absoluteFill, { opacity }]}
      // tint="regular"
      tint="prominent"
      // tint="systemMaterial"
    />
  );
}
