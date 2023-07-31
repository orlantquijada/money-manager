import { forwardRef, useCallback } from "react"
import {
  useBottomSheetSpringConfigs,
  BottomSheetModal,
  BottomSheetBackdropProps,
  BottomSheetHandleProps,
  BottomSheetBackgroundProps,
} from "@gorhom/bottom-sheet"

import { StoreBottomSheetContent } from "./StoreBottomSheetContent"
import {
  CustomBackdrop,
  CustomBackground,
  CustomHandle,
} from "./BottomSheetCustomComponents"

// const snapPoints = ["25%", "94%"]
const snapPoints = ["94%"]
export const storeBottomSheetName = "store-list"

const StoreListBottomSheet = forwardRef<BottomSheetModal>((_, ref) => {
  const springConfig = useBottomSheetSpringConfigs({
    damping: 80,
    stiffness: 350,
  })

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <CustomBackdrop
        {...props}
        appearsOnIndex={0}
        input={[-1, 0]}
        output={[0, 1]}
      />
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
