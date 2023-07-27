import { ComponentProps, forwardRef, RefObject, useMemo } from "react"
import { View } from "react-native"
import {
  BottomSheetBackdropProps,
  BottomSheetHandleProps,
  useBottomSheetSpringConfigs,
  BottomSheetModal,
} from "@gorhom/bottom-sheet"
import Animated, {
  Extrapolate,
  interpolate,
  interpolateColor,
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated"

import { mauveDark } from "~/utils/colors"

import { Backdrop } from "../BottomSheet"
import BottomSheetForm from "./BottomSheetForm"
import { BottomSheetData, useFormData } from "./context"

// const snapPoints = ["25%", "94%"]
// 184 = handle + header + payee + fund height
const snapPoints = [184, "94%"]
const backgroundColor = mauveDark.mauve2

const TransactionCreateBottomSheet = forwardRef<
  BottomSheetModal,
  {
    bottomSheetDataRef: RefObject<BottomSheetData>
  }
>(({ bottomSheetDataRef }, ref) => {
  const springConfig = useBottomSheetSpringConfigs({
    damping: 80,
    stiffness: 350,
  })

  // NOTE: no idea why `useFormData` returns undefined on `<BottomSheetForm />`
  // its probably because `BottomSheet` portals to top most component in the tree?
  const { setFormValues, formData } = useFormData()

  return (
    <BottomSheetModal
      snapPoints={snapPoints}
      stackBehavior="push"
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
      <BottomSheetForm
        setFormValues={setFormValues}
        formData={formData}
        bottomSheetDataRef={bottomSheetDataRef}
      />
    </BottomSheetModal>
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

export type TransactionCreateBottomSheet = BottomSheetModal
export default TransactionCreateBottomSheet
