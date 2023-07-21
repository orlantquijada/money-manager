import { forwardRef } from "react"
import { View } from "react-native"
import {
  BottomSheetModal as GBottomSheetModal,
  BottomSheetModalProps,
  // BottomSheetView,
  useBottomSheetSpringConfigs,
} from "@gorhom/bottom-sheet"
// import { styled } from "nativewind"

import { transitions } from "~/utils/motion"
import { mauve } from "~/utils/colors"

import BottomSheetBackdrop from "./Backdrop"

export const BottomSheetModal = forwardRef<
  GBottomSheetModal,
  BottomSheetModalProps
>(({ handleIndicatorStyle = {}, backgroundStyle = {}, ...props }, ref) => {
  const springConfigs = useBottomSheetSpringConfigs(transitions.snappier)

  return (
    <GBottomSheetModal
      handleIndicatorStyle={[
        { backgroundColor: mauve.mauve5 },
        handleIndicatorStyle,
      ]}
      backgroundStyle={[{ backgroundColor: "transparent" }, backgroundStyle]}
      backdropComponent={BottomSheetBackdrop}
      animationConfigs={springConfigs}
      index={1}
      {...props}
      ref={ref}
    >
      <View className="flex-1">
        {/* @ts-expect-error https://gorhom.github.io/react-native-bottom-sheet/props/#children */}
        {props.children}
      </View>
    </GBottomSheetModal>
  )
})
BottomSheetModal.displayName = "BottomSheetModal"

// const StyledBottomSheetView = styled(BottomSheetView)

export type BottomSheetModal = GBottomSheetModal
