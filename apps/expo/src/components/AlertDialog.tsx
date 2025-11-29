import {
  BottomSheetBackdrop,
  type BottomSheetBackdropProps,
  BottomSheetModal,
  useBottomSheetModal,
  useBottomSheetSpringConfigs,
} from "@gorhom/bottom-sheet";
import { forwardRef } from "react";
import { Text, View } from "react-native";
import { interpolate, useAnimatedStyle } from "react-native-reanimated";
import { tabbarBottomInset } from "~/navigation/TabBar";
import { mauve, mauveA } from "~/utils/colors";
import AlertIcon from "../../assets/icons/alert-triangle.svg";
import CrossIcon from "../../assets/icons/hero-icons/x-mark.svg";
import ScaleDownPressable from "./ScaleDownPressable";

const snapPoints = [273];

const AlertDialog = forwardRef<BottomSheetModal>((_, ref) => {
  const springConfig = useBottomSheetSpringConfigs({
    damping: 30,
    stiffness: 300,
  });

  return (
    <BottomSheetModal
      animationConfigs={springConfig}
      backdropComponent={CustomBackdrop}
      backgroundStyle={{
        backgroundColor: mauve.mauve1,
      }}
      bottomInset={tabbarBottomInset}
      detached
      enablePanDownToClose
      handleComponent={null}
      ref={ref}
      snapPoints={snapPoints}
      style={{ marginHorizontal: 16, borderRadius: 20, overflow: "hidden" }}
    >
      <Content />
    </BottomSheetModal>
  );
});
AlertDialog.displayName = "AlertDialog";

export default AlertDialog;

function Content() {
  const { dismiss } = useBottomSheetModal();

  return (
    <View className="bg-mauve1 p-5">
      <View className="mb-4 flex-row justify-between">
        <View>
          <AlertIcon height={48} strokeWidth={3} width={48} />
        </View>
        <ScaleDownPressable
          className="aspect-square h-6 items-center justify-center rounded-full bg-mauve3"
          onPress={() => dismiss()}
          scale={0.85}
        >
          <CrossIcon
            color={mauve.mauve8}
            height={16}
            strokeWidth={3}
            width={16}
          />
        </ScaleDownPressable>
      </View>

      <Text className="mb-2 font-satoshi-bold text-2xl text-mauve12">
        Hello World
      </Text>
      <Text className="mb-auto font-satoshi-medium text-base text-mauve11">
        Lorem ipsum dolor sit amet, qui minim labore adipisicing minim sint
        cillum sint consectetur cupidatat.
      </Text>

      <View className="mt-8 flex-row space-x-4">
        <ScaleDownPressable
          className="h-10 items-center justify-center rounded-xl bg-mauve3 px-4"
          containerStyle={{ flexGrow: 1 }}
          onPress={() => dismiss()}
        >
          <Text className="font-satoshi-medium text-base text-mauve11">
            Cancel
          </Text>
        </ScaleDownPressable>
        <ScaleDownPressable
          className="h-10 grow items-center justify-center rounded-xl bg-red10 px-4"
          containerStyle={{ flexGrow: 1 }}
          onPress={() => {
            dismiss();
          }}
        >
          <Text className="font-satoshi-medium text-base text-mauve1">
            Remove
          </Text>
        </ScaleDownPressable>
      </View>
    </View>
  );
}

export function CustomBackdrop(props: BottomSheetBackdropProps) {
  const { animatedIndex } = props;

  const containerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(animatedIndex.value, [-1, 0], [0, 1]),
  }));

  return (
    <BottomSheetBackdrop
      {...props}
      appearsOnIndex={0}
      disappearsOnIndex={-1}
      opacity={1}
      pressBehavior="none"
      style={[
        { backgroundColor: mauveA.mauveA8 },
        props.style,
        containerAnimatedStyle,
      ]}
    />
  );
}
