import { ComponentProps, forwardRef, useMemo } from "react"
import { Text, View } from "react-native"
import {
  BottomSheetBackdropProps,
  BottomSheetHandleProps,
  useBottomSheetModal,
  useBottomSheetSpringConfigs,
} from "@gorhom/bottom-sheet"
import Animated, {
  Extrapolate,
  interpolate,
  interpolateColor,
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated"

import { mauveDark } from "~/utils/colors"

import BottomSheet, { Backdrop } from "../BottomSheet"
import Button from "../Button"
import ScaleDownPressable from "../ScaleDownPressable"

import CrossIcon from "../../../assets/icons/hero-icons/x-mark.svg"

const snapPoints = ["25%", "94%"]
const backgroundColor = mauveDark.mauve2

const TransactionCreateBottomSheet = forwardRef<BottomSheet>((_, ref) => {
  const springConfig = useBottomSheetSpringConfigs({
    damping: 80,
    stiffness: 350,
  })

  const { dismissAll } = useBottomSheetModal()

  return (
    <BottomSheet
      snapPoints={snapPoints}
      backdropComponent={CustomBackdrop}
      ref={ref}
      index={1}
      handleComponent={CustomHandle}
      animationConfigs={springConfig}
      backgroundComponent={CustomBackground}
      name="transaction-create"
      style={{
        borderTopStartRadius: 15,
        borderTopEndRadius: 15,
        overflow: "hidden",
      }}
    >
      <View className="flex-1 px-4">
        <View className="flex-row items-center justify-between">
          <ScaleDownPressable onPress={dismissAll}>
            <CrossIcon
              color={mauveDark.mauve12}
              width={20}
              height={20}
              strokeWidth={3}
            />
          </ScaleDownPressable>

          <Button>
            <Text className="font-satoshi-medium text-mauve12 text-base">
              Save
            </Text>
          </Button>
        </View>
      </View>
    </BottomSheet>
  )
})
TransactionCreateBottomSheet.displayName = "TransactionCreateBottomSheet"

function CustomBackdrop(props: ComponentProps<typeof Backdrop>) {
  const { animatedIndex } = props

  const containerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      animatedIndex.value,
      [-1, 0, 1],
      [0, 0.2, 1],
      Extrapolate.CLAMP,
    ),
  }))

  return (
    <Backdrop
      {...props}
      appearsOnIndex={1}
      disappearsOnIndex={-1}
      opacity={1}
      style={[{ backgroundColor }, props.style, containerAnimatedStyle]}
    />
  )
}

function CustomBackground({ animatedIndex, style }: BottomSheetBackdropProps) {
  const containerAnimatedStyle = useBackgroundColor(animatedIndex)
  const containerStyle = useMemo(
    () => [style, containerAnimatedStyle],
    [style, containerAnimatedStyle],
  )

  return <Animated.View pointerEvents="none" style={containerStyle} />
}

function CustomHandle({ animatedIndex }: BottomSheetHandleProps) {
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

export type TransactionCreateBottomSheet = BottomSheet
export default TransactionCreateBottomSheet
