import { forwardRef, useCallback } from "react"
import {
  useBottomSheetSpringConfigs,
  BottomSheetModal,
  BottomSheetBackdropProps,
  BottomSheetHandleProps,
  BottomSheetBackgroundProps,
} from "@gorhom/bottom-sheet"

import {
  CustomBackdrop,
  CustomBackground,
  CustomHandle,
} from "./BottomSheetCustomComponents"
import { FundBottomSheetContent } from "./FundBottomSheetContent"

// const snapPoints = ["25%", "94%"]
const snapPoints = ["94%"]
export const fundBottomSheetName = "fund-list"

const FundListBottomSheet = forwardRef<BottomSheetModal>((_, ref) => {
  const springConfig = useBottomSheetSpringConfigs({
    damping: 80,
    stiffness: 350,
  })

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <CustomBackdrop {...props} input={[-1, 0]} output={[0, 1]} />
    ),
    [],
  )
  const renderHandle = useCallback(
    (props: BottomSheetHandleProps) => (
      <CustomHandle {...props} input={[-1, 0]} />
    ),
    [],
  )
  const renderBackground = useCallback(
    (props: BottomSheetBackgroundProps) => (
      <CustomBackground {...props} input={[-1, 0]} />
    ),
    [],
  )

  return (
    <BottomSheetModal
      snapPoints={snapPoints}
      ref={ref}
      stackBehavior="push"
      index={0}
      handleComponent={renderHandle}
      backdropComponent={renderBackdrop}
      backgroundComponent={renderBackground}
      animationConfigs={springConfig}
      name={fundBottomSheetName}
      key={fundBottomSheetName}
      style={{
        borderTopStartRadius: 15,
        borderTopEndRadius: 15,
        overflow: "hidden",
      }}
      enablePanDownToClose
    >
      <FundBottomSheetContent />
    </BottomSheetModal>
  )
})
FundListBottomSheet.displayName = "FundBottomSheet"
export type FundBottomSheet = BottomSheetModal
export default FundListBottomSheet
