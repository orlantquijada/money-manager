import {
  type BottomSheetBackdropProps,
  type BottomSheetBackgroundProps,
  type BottomSheetHandleProps,
  BottomSheetModal,
  useBottomSheetSpringConfigs,
} from "@gorhom/bottom-sheet";
import { forwardRef, type RefObject, useCallback } from "react";

import type { BottomSheetData } from "~/utils/hooks/useTransactionStore";
import {
  CustomBackdrop,
  CustomBackground,
  CustomHandle,
} from "./BottomSheetCustomComponents";
import BottomSheetForm from "./BottomSheetForm";

// const snapPoints = ["25%", "94%"]
// 184 = handle + header + payee + fund height
const snapPoints = [184, "94%"];

const TransactionCreateBottomSheet = forwardRef<
  BottomSheetModal,
  {
    bottomSheetDataRef: RefObject<BottomSheetData>;
    openFundListBottomSheet: () => void;
    openStoreListBottomSheet: () => void;
  }
>(
  (
    { bottomSheetDataRef, openFundListBottomSheet, openStoreListBottomSheet },
    ref
  ) => {
    const springConfig = useBottomSheetSpringConfigs({
      damping: 80,
      stiffness: 350,
    });

    const renderBackdrop = useCallback(
      (props: BottomSheetBackdropProps) => (
        <CustomBackdrop
          {...props}
          appearsOnIndex={1}
          input={[-1, 0, 1]}
          output={[0, 0.2, 1]}
        />
      ),
      []
    );
    const renderHandle = useCallback(
      (props: BottomSheetHandleProps) => (
        <CustomHandle {...props} input={[0, 1]} />
      ),
      []
    );
    const renderBackground = useCallback(
      (props: BottomSheetBackgroundProps) => (
        <CustomBackground {...props} input={[0, 1]} />
      ),
      []
    );

    return (
      <BottomSheetModal
        animationConfigs={springConfig}
        backdropComponent={renderBackdrop}
        backgroundComponent={renderBackground}
        handleComponent={renderHandle}
        index={1}
        name="transaction-create"
        ref={ref}
        snapPoints={snapPoints}
        style={{
          borderTopStartRadius: 15,
          borderTopEndRadius: 15,
          overflow: "hidden",
        }}
      >
        <BottomSheetForm
          bottomSheetDataRef={bottomSheetDataRef}
          openFundListBottomSheet={openFundListBottomSheet}
          openStoreListBottomSheet={openStoreListBottomSheet}
        />
      </BottomSheetModal>
    );
  }
);
TransactionCreateBottomSheet.displayName = "TransactionCreateBottomSheet";

export type TransactionCreateBottomSheet = BottomSheetModal;
export default TransactionCreateBottomSheet;
