import {
  type BottomSheetModalProps,
  BottomSheetModal as GBottomSheetModal,
  // BottomSheetView,
  useBottomSheetSpringConfigs,
} from "@gorhom/bottom-sheet";
import { forwardRef } from "react";
import { View } from "react-native";

// import { styled } from "nativewind"

import { mauve } from "~/utils/colors";
import { transitions } from "~/utils/motion";

import BottomSheetBackdrop from "./Backdrop";

export const BottomSheetModal = forwardRef<
  GBottomSheetModal,
  BottomSheetModalProps
>(({ handleIndicatorStyle = {}, backgroundStyle = {}, ...props }, ref) => {
  const springConfigs = useBottomSheetSpringConfigs(transitions.snappier);

  return (
    <GBottomSheetModal
      animationConfigs={springConfigs}
      backdropComponent={BottomSheetBackdrop}
      backgroundStyle={[{ backgroundColor: "transparent" }, backgroundStyle]}
      handleIndicatorStyle={[
        { backgroundColor: mauve.mauve5 },
        handleIndicatorStyle,
      ]}
      index={1}
      {...props}
      ref={ref}
    >
      <View className="flex-1">
        {/* @ts-expect-error https://gorhom.github.io/react-native-bottom-sheet/props/#children */}
        {props.children}
      </View>
    </GBottomSheetModal>
  );
});
BottomSheetModal.displayName = "BottomSheetModal";

// const StyledBottomSheetView = styled(BottomSheetView)

export type BottomSheetModal = GBottomSheetModal;
