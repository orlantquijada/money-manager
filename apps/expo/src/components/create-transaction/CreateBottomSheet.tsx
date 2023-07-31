import { forwardRef, RefObject, useCallback } from "react"
import {
  useBottomSheetSpringConfigs,
  BottomSheetModal,
  BottomSheetBackdropProps,
  BottomSheetHandleProps,
  BottomSheetBackgroundProps,
} from "@gorhom/bottom-sheet"

import { BottomSheetData } from "~/utils/hooks/useTransactionStore"

import BottomSheetForm from "./BottomSheetForm"
import {
  CustomBackdrop,
  CustomBackground,
  CustomHandle,
} from "./BottomSheetCustomComponents"

// const snapPoints = ["25%", "94%"]
// 184 = handle + header + payee + fund height
const snapPoints = [184, "94%"]

const TransactionCreateBottomSheet = forwardRef<
  BottomSheetModal,
  {
    bottomSheetDataRef: RefObject<BottomSheetData>
    openFundListBottomSheet: () => void
    openStoreListBottomSheet: () => void
  }
>(
  (
    { bottomSheetDataRef, openFundListBottomSheet, openStoreListBottomSheet },
    ref,
  ) => {
    const springConfig = useBottomSheetSpringConfigs({
      damping: 80,
      stiffness: 350,
    })

    const renderBackdrop = useCallback(
      (props: BottomSheetBackdropProps) => (
        <CustomBackdrop
          {...props}
          appearsOnIndex={1}
          input={[-1, 0, 1]}
          output={[0, 0.2, 1]}
        />
      ),
      [],
    )
    const renderHandle = useCallback(
      (props: BottomSheetHandleProps) => (
        <CustomHandle {...props} input={[0, 1]} />
      ),
      [],
    )
    const renderBackground = useCallback(
      (props: BottomSheetBackgroundProps) => (
        <CustomBackground {...props} input={[0, 1]} />
      ),
      [],
    )

    return (
      <BottomSheetModal
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
        ref={ref}
        index={1}
        handleComponent={renderHandle}
        animationConfigs={springConfig}
        backgroundComponent={renderBackground}
        name="transaction-create"
        style={{
          borderTopStartRadius: 15,
          borderTopEndRadius: 15,
          overflow: "hidden",
        }}
      >
        <BottomSheetForm
          bottomSheetDataRef={bottomSheetDataRef}
          openStoreListBottomSheet={openStoreListBottomSheet}
          openFundListBottomSheet={openFundListBottomSheet}
        />
      </BottomSheetModal>
    )
  },
)
TransactionCreateBottomSheet.displayName = "TransactionCreateBottomSheet"

export type TransactionCreateBottomSheet = BottomSheetModal
export default TransactionCreateBottomSheet
