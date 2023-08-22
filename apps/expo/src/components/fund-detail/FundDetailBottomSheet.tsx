import {
  BottomSheetBackdropProps,
  BottomSheetModal,
  useBottomSheetSpringConfigs,
} from "@gorhom/bottom-sheet"
import { forwardRef } from "react"
import { interpolate, useAnimatedStyle } from "react-native-reanimated"
import { tabbarBottomInset } from "~/navigation/TabBar"
import BottomSheetBackdrop from "../BottomSheet/Backdrop"
import { mauve, mauveA } from "~/utils/colors"

import { FundWithMeta } from "~/types"
import FundDetailContent from "./FundDetailContent"

const snapPoints = ["50%"]

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
        handleIndicatorStyle={{ backgroundColor: mauve.mauve5 }}
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
    opacity: interpolate(animatedIndex.value, [-1, 0], [0, 1]),
  }))

  return (
    <BottomSheetBackdrop
      {...props}
      appearsOnIndex={0}
      disappearsOnIndex={-1}
      opacity={1}
      style={[
        { backgroundColor: mauveA.mauveA8 },
        props.style,
        containerAnimatedStyle,
      ]}
    />
  )
}
