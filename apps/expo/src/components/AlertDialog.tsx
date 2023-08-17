import { forwardRef } from "react"
import { Text, View } from "react-native"
import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  useBottomSheetModal,
  useBottomSheetSpringConfigs,
} from "@gorhom/bottom-sheet"
import { interpolate, useAnimatedStyle } from "react-native-reanimated"

import { mauve, mauveA } from "~/utils/colors"
import { tabbarBottomInset } from "~/navigation/TabBar"

import ScaleDownPressable from "./ScaleDownPressable"

import AlertIcon from "../../assets/icons/alert-triangle.svg"
import CrossIcon from "../../assets/icons/hero-icons/x-mark.svg"

const snapPoints = [273]

const AlertDialog = forwardRef<BottomSheetModal>((_, ref) => {
  const springConfig = useBottomSheetSpringConfigs({
    damping: 30,
    stiffness: 300,
  })

  return (
    <BottomSheetModal
      ref={ref}
      handleComponent={null}
      animationConfigs={springConfig}
      backdropComponent={CustomBackdrop}
      backgroundStyle={{
        backgroundColor: mauve.mauve1,
      }}
      detached
      bottomInset={tabbarBottomInset}
      style={{ marginHorizontal: 16, borderRadius: 20, overflow: "hidden" }}
      snapPoints={snapPoints}
      enablePanDownToClose
    >
      <Content />
    </BottomSheetModal>
  )
})
AlertDialog.displayName = "AlertDialog"

export default AlertDialog

function Content() {
  const { dismiss } = useBottomSheetModal()

  return (
    <View className="bg-mauve1 p-5">
      <View className="mb-4 flex-row justify-between">
        <View>
          <AlertIcon width={48} height={48} strokeWidth={3} />
        </View>
        <ScaleDownPressable
          scale={0.85}
          className="bg-mauve3 aspect-square h-6 items-center justify-center rounded-full"
          onPress={() => dismiss()}
        >
          <CrossIcon
            width={16}
            height={16}
            strokeWidth={3}
            color={mauve.mauve8}
          />
        </ScaleDownPressable>
      </View>

      <Text className="text-mauve12 font-satoshi-bold mb-2 text-2xl">
        Hello World
      </Text>
      <Text className="text-mauve11 font-satoshi-medium mb-auto text-base">
        Lorem ipsum dolor sit amet, qui minim labore adipisicing minim sint
        cillum sint consectetur cupidatat.
      </Text>

      <View className="mt-8 flex-row space-x-4">
        <ScaleDownPressable
          containerStyle={{ flexGrow: 1 }}
          className="bg-mauve3 h-10 items-center justify-center rounded-xl px-4"
          onPress={() => dismiss()}
        >
          <Text className="text-mauve11 font-satoshi-medium text-base">
            Cancel
          </Text>
        </ScaleDownPressable>
        <ScaleDownPressable
          containerStyle={{ flexGrow: 1 }}
          className="bg-red10 h-10 grow items-center justify-center rounded-xl px-4"
          onPress={() => {
            dismiss()
          }}
        >
          <Text className="text-mauve1 font-satoshi-medium text-base">
            Remove
          </Text>
        </ScaleDownPressable>
      </View>
    </View>
  )
}

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
      pressBehavior="none"
      style={[
        { backgroundColor: mauveA.mauveA8 },
        props.style,
        containerAnimatedStyle,
      ]}
    />
  )
}
