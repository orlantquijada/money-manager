import { forwardRef } from "react"
import {
  BottomSheetModal as GBottomSheetModal,
  BottomSheetModalProps,
  useBottomSheetSpringConfigs,
  useBottomSheetTimingConfigs,
} from "@gorhom/bottom-sheet"
import { mauve } from "~/utils/colors"
import BottomSheetBackdrop from "./Backdrop"
import { Easing } from "react-native-reanimated"

export const BottomSheetModal = forwardRef<
  GBottomSheetModal,
  BottomSheetModalProps
>(({ handleIndicatorStyle = {}, ...props }, ref) => {
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
      backdropComponent={BottomSheetBackdrop}
      animationConfigs={{ ...timingConfigs, ...springConfigs }}
      index={1}
      {...props}
      ref={ref}
    />
  )
})
BottomSheetModal.displayName = "BottomSheetModal"

export type BottomSheetModal = GBottomSheetModal
