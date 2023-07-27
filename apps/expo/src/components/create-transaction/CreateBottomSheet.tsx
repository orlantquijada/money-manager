import { forwardRef, RefObject } from "react"
import {
  useBottomSheetSpringConfigs,
  BottomSheetModal,
} from "@gorhom/bottom-sheet"

import BottomSheetForm from "./BottomSheetForm"
import { BottomSheetData, useFormData } from "./context"
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
    storeListBottomSheetRef: RefObject<BottomSheetModal>
  }
>(({ bottomSheetDataRef, storeListBottomSheetRef }, ref) => {
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
        storeListBottomSheetRef={storeListBottomSheetRef}
      />
    </BottomSheetModal>
  )
})
TransactionCreateBottomSheet.displayName = "TransactionCreateBottomSheet"

export type TransactionCreateBottomSheet = BottomSheetModal
export default TransactionCreateBottomSheet
