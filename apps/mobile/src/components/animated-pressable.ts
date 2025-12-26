import type { ComponentProps } from "react";
import { Pressable } from "react-native";
import Animated from "react-native-reanimated";

export const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
export type AnimatedPressableProps = ComponentProps<typeof AnimatedPressable>;
