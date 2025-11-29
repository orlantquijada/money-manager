import {
  BottomSheetBackdrop,
  type BottomSheetBackdropProps,
  type BottomSheetHandleProps,
} from "@gorhom/bottom-sheet";
import { useMemo } from "react";
import { View } from "react-native";
import Animated, {
  interpolate,
  interpolateColor,
  type SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";

import { mauveDark } from "~/utils/colors";

const backgroundColor = mauveDark.mauve2;

export function CustomBackdrop(
  props: BottomSheetBackdropProps & {
    input: number[];
    output: number[];
    appearsOnIndex: number;
  }
) {
  const { animatedIndex, output, input, appearsOnIndex } = props;

  const containerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(animatedIndex.value, input, output),
  }));

  return (
    <BottomSheetBackdrop
      {...props}
      appearsOnIndex={appearsOnIndex}
      disappearsOnIndex={-1}
      opacity={1}
      style={[{ backgroundColor }, props.style, containerAnimatedStyle]}
    />
  );
}

export function CustomBackground({
  animatedIndex,
  style,
  input,
}: BottomSheetBackdropProps & {
  input: number[];
}) {
  const containerAnimatedStyle = useBackgroundColor(animatedIndex, input);
  const containerStyle = useMemo(
    () => [style, containerAnimatedStyle],
    [style, containerAnimatedStyle]
  );

  return <Animated.View pointerEvents="none" style={containerStyle} />;
}

export function CustomHandle({
  animatedIndex,
  input,
}: BottomSheetHandleProps & {
  input: number[];
}) {
  const containerAnimatedStyle = useBackgroundColor(animatedIndex, input);
  const containerStyle = useMemo(
    () => [containerAnimatedStyle],
    [containerAnimatedStyle]
  );

  return (
    <Animated.View
      className="h-6 items-center justify-center"
      pointerEvents="none"
      style={containerStyle}
    >
      <View className="h-1 w-[27px] rounded-full bg-mauveDark8" />
    </Animated.View>
  );
}

export function useBackgroundColor(
  animatedIndex: SharedValue<number>,
  inputValues: number[]
) {
  return useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(animatedIndex.value, inputValues, [
      mauveDark.mauve3,
      backgroundColor,
    ]),
  }));
}
