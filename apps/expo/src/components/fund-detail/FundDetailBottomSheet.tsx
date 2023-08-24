import {
  BottomSheetBackdropProps,
  BottomSheetHandleProps,
  BottomSheetModal,
  useBottomSheetSpringConfigs,
} from "@gorhom/bottom-sheet"
import { forwardRef } from "react"
import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedStyle,
} from "react-native-reanimated"
import { tabbarBottomInset } from "~/navigation/TabBar"
import BottomSheetBackdrop from "../BottomSheet/Backdrop"
import { mauveA } from "~/utils/colors"

import { FundWithMeta } from "~/types"
import FundDetailContent from "./FundDetailContent"
import { View } from "moti"

const snapPoints = ["50%", "92%"]

type Props = {
  fund: FundWithMeta
}

const FundDetailBottomSheet = forwardRef<BottomSheetModal, Props>(
  ({ fund }, ref) => {
    const springConfig = useBottomSheetSpringConfigs({
      stiffness: 250,
      damping: 50,
    })
    return (
      <BottomSheetModal
        ref={ref}
        snapPoints={snapPoints}
        bottomInset={tabbarBottomInset}
        backdropComponent={CustomBackdrop}
        handleComponent={CustomHandle}
        animationConfigs={springConfig}
        detached
        style={{
          marginHorizontal: 16,
          borderRadius: 20,
          overflow: "hidden",
        }}
      >
        <FundDetailContent fund={fund} />
      </BottomSheetModal>
    )
  },
)
FundDetailBottomSheet.displayName = "FundDetailBottomSheet"

export default FundDetailBottomSheet

export function CustomBackdrop(props: BottomSheetBackdropProps) {
  const { animatedIndex } = props

  const containerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(animatedIndex.value, [-1, 0, 1], [0, 1, 1]),
    backgroundColor: interpolateColor(
      animatedIndex.value,
      [-1, 0, 1],
      [mauveA.mauveA8, mauveA.mauveA8, "#ffffff"],
    ),
  }))

  return (
    <BottomSheetBackdrop
      {...props}
      appearsOnIndex={0}
      disappearsOnIndex={-1}
      opacity={1}
      style={[
        // { backgroundColor: mauveA.mauveA8 },
        props.style,
        containerAnimatedStyle,
      ]}
    />
  )
}

export function CustomHandle({ animatedIndex }: BottomSheetHandleProps) {
  const containerStyle = useAnimatedStyle(() => ({
    opacity: interpolate(animatedIndex.value, [-1, 0, 1], [1, 1, 0]),
  }))

  return (
    <Animated.View
      pointerEvents="none"
      style={containerStyle}
      className="h-6 items-center justify-center"
    >
      <View className="bg-mauve5 h-1 w-[27px] rounded-full" />
    </Animated.View>
  )
}
