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

export function CustomBackdrop(props: BottomSheetBackdropProps) {
  const { animatedIndex } = props

  const containerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(animatedIndex.value, [-1, 0, 1], [0, 0.2, 1]),
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
}: BottomSheetBackdropProps) {
  const containerAnimatedStyle = useBackgroundColor(animatedIndex)
  const containerStyle = useMemo(
    () => [style, containerAnimatedStyle],
    [style, containerAnimatedStyle],
  )

  return <Animated.View pointerEvents="none" style={containerStyle} />
}

export function CustomHandle({ animatedIndex }: BottomSheetHandleProps) {
  const containerAnimatedStyle = useBackgroundColor(animatedIndex)
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

function useBackgroundColor(animatedIndex: SharedValue<number>) {
  return useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      animatedIndex.value,
      [0, 1],
      [mauveDark.mauve3, backgroundColor],
    ),
  }))
}
