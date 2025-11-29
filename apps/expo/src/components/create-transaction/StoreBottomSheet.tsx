import {
  type BottomSheetBackdropProps,
  type BottomSheetBackgroundProps,
  type BottomSheetHandleProps,
  BottomSheetModal,
  useBottomSheetSpringConfigs,
} from "@gorhom/bottom-sheet";
import { forwardRef, useCallback } from "react";
import {
  CustomBackdrop,
  CustomBackground,
  CustomHandle,
} from "./BottomSheetCustomComponents";
import { StoreBottomSheetContent } from "./StoreBottomSheetContent";

// const snapPoints = ["25%", "94%"]
const snapPoints = ["94%"];
export const storeBottomSheetName = "store-list";

const StoreListBottomSheet = forwardRef<BottomSheetModal>((_, ref) => {
  const springConfig = useBottomSheetSpringConfigs({
    damping: 80,
    stiffness: 350,
  });

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <CustomBackdrop
        {...props}
        appearsOnIndex={0}
        input={[-1, 0]}
        output={[0, 1]}
      />
    ),
    []
  );
  const renderHandle = useCallback(
    (props: BottomSheetHandleProps) => (
      <CustomHandle {...props} input={[-1, 0]} />
    ),
    []
  );
  const renderBackground = useCallback(
    (props: BottomSheetBackgroundProps) => (
      <CustomBackground {...props} input={[-1, 0]} />
    ),
    []
  );

  return (
    <BottomSheetModal
      animationConfigs={springConfig}
      backdropComponent={renderBackdrop}
      backgroundComponent={renderBackground}
      enablePanDownToClose
      handleComponent={renderHandle}
      index={0}
      key={storeBottomSheetName}
      name={storeBottomSheetName}
      ref={ref}
      snapPoints={snapPoints}
      stackBehavior="push"
      style={{
        borderTopStartRadius: 15,
        borderTopEndRadius: 15,
        overflow: "hidden",
      }}
    >
      <StoreBottomSheetContent />
    </BottomSheetModal>
  );
});
StoreListBottomSheet.displayName = "StoreListBottomSheet";
export type StoreListBottomSheet = BottomSheetModal;
export default StoreListBottomSheet;
