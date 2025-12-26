import { LinearGradient } from "expo-linear-gradient";
import type { ComponentProps } from "react";
import Animated from "react-native-reanimated";

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);
export type AnimatedLinearGradientProps = ComponentProps<
  typeof AnimatedLinearGradient
>;

export default AnimatedLinearGradient;
