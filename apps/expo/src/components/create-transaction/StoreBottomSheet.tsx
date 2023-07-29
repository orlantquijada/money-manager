import { forwardRef, useMemo } from "react"
import { View } from "react-native"
import {
  useBottomSheetSpringConfigs,
  BottomSheetModal,
  BottomSheetBackdropProps,
  BottomSheetHandleProps,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet"
import Animated, {
  interpolate,
  interpolateColor,
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated"

import { mauveDark } from "~/utils/colors"

import { StoreBottomSheetContent } from "./StoreBottomSheetContent"

// const snapPoints = ["25%", "94%"]
const snapPoints = ["94%"]
export const storeBottomSheetName = "store-list"

const StoreListBottomSheet = forwardRef<BottomSheetModal>((_, ref) => {
  const springConfig = useBottomSheetSpringConfigs({
    damping: 80,
    stiffness: 350,
  })

  return (
    <BottomSheetModal
      snapPoints={snapPoints}
      backdropComponent={CustomBackdrop}
      ref={ref}
      stackBehavior="push"
      index={0}
      handleComponent={CustomHandle}
      animationConfigs={springConfig}
      backgroundComponent={CustomBackground}
      name={storeBottomSheetName}
      key={storeBottomSheetName}
      style={{
        borderTopStartRadius: 15,
        borderTopEndRadius: 15,
        overflow: "hidden",
      }}
      enablePanDownToClose
    >
      <StoreBottomSheetContent />
    </BottomSheetModal>
  )
})
StoreListBottomSheet.displayName = "StoreListBottomSheet"
export type StoreListBottomSheet = BottomSheetModal
export default StoreListBottomSheet

const backgroundColor = mauveDark.mauve2

export function CustomBackdrop(props: BottomSheetBackdropProps) {
  const { animatedIndex } = props

  const containerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(animatedIndex.value, [-1, 0], [0, 1]),
  }))

  return (
    <BottomSheetBackdrop
      {...props}
      appearsOnIndex={0}
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
  const containerAnimatedStyle = useBackgroundColor(animatedIndex, [-1, 0])
  const containerStyle = useMemo(
    () => [style, containerAnimatedStyle],
    [style, containerAnimatedStyle],
  )

  return <Animated.View pointerEvents="none" style={containerStyle} />
}

export function CustomHandle({ animatedIndex }: BottomSheetHandleProps) {
  const containerAnimatedStyle = useBackgroundColor(animatedIndex, [-1, 0])
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

function useBackgroundColor(
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
