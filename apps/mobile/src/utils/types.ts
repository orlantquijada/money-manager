import type { Animated } from "react-native";

export type IconProps = {
  className?: string;
  color?: string;
  size?: number;
};

export type TabBarIconProps = IconProps & {
  fillOpacity: Animated.AnimatedInterpolation<number>;
  outlineOpacity: Animated.AnimatedInterpolation<number>;
};
