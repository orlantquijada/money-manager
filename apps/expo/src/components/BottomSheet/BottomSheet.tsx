import { forwardRef } from "react"
import { View } from "react-native"
import { Easing } from "react-native-reanimated"
import {
  BottomSheetModal as GBottomSheetModal,
  BottomSheetModalProps,
  useBottomSheetSpringConfigs,
  useBottomSheetTimingConfigs,
} from "@gorhom/bottom-sheet"

import { mauve, violet } from "~/utils/colors"

import BottomSheetBackdrop from "./Backdrop"

export const BottomSheetModal = forwardRef<
  GBottomSheetModal,
  BottomSheetModalProps
>(({ handleIndicatorStyle = {}, backgroundStyle = {}, ...props }, ref) => {
  const timingConfigs = useBottomSheetTimingConfigs({
    duration: 500,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  })
  const springConfigs = useBottomSheetSpringConfigs({
    damping: 90,
    overshootClamping: true,
    restDisplacementThreshold: 0.1,
    restSpeedThreshold: 0.1,
    stiffness: 10,
  })

  return (
    <GBottomSheetModal
      handleIndicatorStyle={[
        { backgroundColor: mauve.mauve5 },
        handleIndicatorStyle,
      ]}
      backgroundStyle={[{ backgroundColor: violet.violet1 }, backgroundStyle]}
      backdropComponent={BottomSheetBackdrop}
      animationConfigs={{ ...timingConfigs, ...springConfigs }}
      index={1}
      {...props}
      ref={ref}
    >
      {/* @ts-expect-error https://gorhom.github.io/react-native-bottom-sheet/props/#children */}
      <View className="bg-violet1 flex-1">{props.children}</View>
    </GBottomSheetModal>
  )
})
BottomSheetModal.displayName = "BottomSheetModal"

export type BottomSheetModal = GBottomSheetModal
