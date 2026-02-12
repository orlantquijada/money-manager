import { useEffect } from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { StyledLeanView } from "@/config/interop";
import { mauve } from "@/utils/colors";

// Match geometry from pie-chart-segmented.tsx
const FOCUS_OFFSET = 8;
const INNER_RADIUS_RATIO = 0.7;

type Props = {
  size?: number;
};

export default function PieChartSkeleton({ size = 150 }: Props) {
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.set(withRepeat(withTiming(0.7, { duration: 800 }), -1, true));
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.get(),
  }));

  const outerRadius = size / 2 - FOCUS_OFFSET;
  const innerRadius = outerRadius * INNER_RADIUS_RATIO;
  const innerSize = innerRadius * 2;

  return (
    <StyledLeanView
      className="items-center justify-center"
      style={{ width: size, height: size }}
    >
      <Animated.View
        className="items-center justify-center rounded-full"
        style={[
          {
            width: outerRadius * 2,
            height: outerRadius * 2,
            backgroundColor: mauve.mauve6,
          },
          animatedStyle,
        ]}
      >
        {/* Inner circle cutout to create donut shape */}
        <StyledLeanView
          className="rounded-full bg-background"
          style={{ width: innerSize, height: innerSize }}
        />
      </Animated.View>
    </StyledLeanView>
  );
}
