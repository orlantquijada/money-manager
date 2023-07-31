import { useMemo } from "react"
import { View } from "react-native"
import Animated, {
  interpolate,
  interpolateColor,
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated"
import {
  BottomSheetBackdropProps,
  BottomSheetHandleProps,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet"

import { mauveDark } from "~/utils/colors"

const backgroundColor = mauveDark.mauve2

export function CustomBackdrop(
  props: BottomSheetBackdropProps & {
    input: number[]
    output: number[]
  },
) {
  const { animatedIndex, output, input } = props

  const containerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(animatedIndex.value, input, output),
  }))

  return (
    <BottomSheetBackdrop
      {...props}
      appearsOnIndex={1}
      disappearsOnIndex={-1}
      opacity={1}
      style={[{ backgroundColor }, props.style, containerAnimatedStyle]}
    />
  )
}

export function CustomBackground({
  animatedIndex,
  style,
  input,
}: BottomSheetBackdropProps & {
  input: number[]
}) {
  const containerAnimatedStyle = useBackgroundColor(animatedIndex, input)
  const containerStyle = useMemo(
    () => [style, containerAnimatedStyle],
    [style, containerAnimatedStyle],
  )

  return <Animated.View pointerEvents="none" style={containerStyle} />
}

export function CustomHandle({
  animatedIndex,
  input,
}: BottomSheetHandleProps & {
  input: number[]
}) {
  const containerAnimatedStyle = useBackgroundColor(animatedIndex, input)
  const containerStyle = useMemo(
    () => [containerAnimatedStyle],
    [containerAnimatedStyle],
  )

  return (
    <Animated.View
      pointerEvents="none"
      style={containerStyle}
      className="h-6 items-center justify-center"
    >
      <View className="bg-mauveDark8 h-1 w-[27px] rounded-full" />
    </Animated.View>
  )
}

export function useBackgroundColor(
  animatedIndex: SharedValue<number>,
  inputValues: number[],
) {
  return useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(animatedIndex.value, inputValues, [
      mauveDark.mauve3,
      backgroundColor,
    ]),
  }))
}
