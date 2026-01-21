import { useEffect } from "react";
import Animated, {
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { mauve } from "@/utils/colors";

type Props = {
  width: number;
  height: number;
};

export default function Skeleton({ width, height }: Props) {
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.set(withRepeat(withTiming(0.7, { duration: 800 }), -1, true));
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.get(),
  }));

  return (
    <Animated.View
      entering={FadeIn.duration(200)}
      exiting={FadeOut.duration(200)}
    >
      <Animated.View
        className="rounded-lg"
        style={[
          {
            width,
            height,
            backgroundColor: mauve.mauve6,
            borderCurve: "continuous",
          },
          animatedStyle,
        ]}
      />
    </Animated.View>
  );
}
