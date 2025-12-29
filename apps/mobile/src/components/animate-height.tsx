import { type ReactNode, useCallback } from "react";
import { type LayoutChangeEvent, StyleSheet, View } from "react-native";
import Animated, {
  type SharedValue,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { transitions } from "@/utils/motion";

type Props = {
  isExpanded: SharedValue<boolean>;
  children: ReactNode;
  top?: boolean;
};

export default function AnimateHeight({ isExpanded, children }: Props) {
  const { handleOnLayout, measuredHeight } = useMeasureHeight();

  const height = useDerivedValue(() =>
    withSpring(
      measuredHeight.get() * Number(isExpanded.get()),
      transitions.snappy
    )
  );
  const scale = useDerivedValue(() =>
    withSpring(isExpanded.get() ? 1 : 0.9, transitions.snappy)
  );
  const translateY = useDerivedValue(() =>
    withSpring(isExpanded.get() ? 0 : -25, transitions.snappy)
  );
  const opacity = useDerivedValue(() =>
    withSpring(isExpanded.get() ? 1 : 0, transitions.snappy)
  );

  const bodyStyle = useAnimatedStyle(() => ({
    height: height.get(),
    transform: [{ scale: scale.get() }, { translateY: translateY.get() }],
    opacity: opacity.get(),
  }));

  return (
    <Animated.View className="w-full overflow-hidden" style={bodyStyle}>
      <View
        onLayout={handleOnLayout}
        style={{ ...StyleSheet.absoluteFillObject, bottom: "auto" }}
      >
        {children}
      </View>
    </Animated.View>
  );
}

export function useMeasureHeight(initalHeight = 0) {
  const measuredHeight = useSharedValue(initalHeight);
  const handleOnLayout = useCallback(
    ({ nativeEvent }: LayoutChangeEvent) => {
      measuredHeight.value = nativeEvent.layout.height;
    },
    [measuredHeight]
  );

  return { measuredHeight, handleOnLayout } as const;
}
