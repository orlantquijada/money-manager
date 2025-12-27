import { motifySvg } from "@alloc/moti/svg";
import { Animated } from "react-native";
import Svg, { Path } from "react-native-svg";

export const AnimatedPath = Animated.createAnimatedComponent(Path);
export const AnimatedSvg = motifySvg(Svg)();
