import {
  BottomSheetBackdrop,
  type BottomSheetModalProps,
  BottomSheetModal as GorhomBottomSheetModal,
} from "@gorhom/bottom-sheet";
import { type ComponentPropsWithoutRef, type Ref, useMemo } from "react";
import {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";
import { mauveDark } from "@/utils/colors";

type Props = {
  ref?: Ref<GorhomBottomSheetModal>;
} & BottomSheetModalProps;

function BottomSheetModal({
  ref,
  children,
  backgroundStyle,
  handleIndicatorStyle,
  ...props
}: Props) {
  return (
    <GorhomBottomSheetModal
      backdropComponent={Backdrop}
      backgroundStyle={[
        { backgroundColor: mauveDark.mauveDark3 },
        backgroundStyle,
      ]}
      handleIndicatorStyle={[
        {
          width: 80,
          height: 4,
          backgroundColor: mauveDark.mauveDark6,
        },
        handleIndicatorStyle,
      ]}
      ref={ref}
      {...props}
    >
      {children}
    </GorhomBottomSheetModal>
  );
}
type BottomSheetModal = GorhomBottomSheetModal;

function Backdrop({
  style,
  ...props
}: ComponentPropsWithoutRef<typeof BottomSheetBackdrop>) {
  const containerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      props.animatedIndex.value,
      [-1, 0],
      [0, 0.9],
      Extrapolation.CLAMP
    ),
  }));

  const containerStyle = useMemo(
    () => [
      style,
      { backgroundColor: mauveDark.mauveDark1 },
      containerAnimatedStyle,
    ],
    [style, containerAnimatedStyle]
  );

  return (
    <BottomSheetBackdrop
      appearsOnIndex={0}
      disappearsOnIndex={-1}
      style={containerStyle}
      {...props}
    />
  );
}

export default BottomSheetModal;
