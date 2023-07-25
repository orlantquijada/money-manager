import { ComponentProps, forwardRef, useMemo, useRef, useState } from "react"
import { Text, TextInput, View } from "react-native"
import {
  BottomSheetBackdropProps,
  BottomSheetHandleProps,
  useBottomSheetModal,
  useBottomSheetSpringConfigs,
} from "@gorhom/bottom-sheet"
import Animated, {
  Extrapolate,
  interpolate,
  interpolateColor,
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated"

import { mauveDark } from "~/utils/colors"

import BottomSheet, { Backdrop } from "../BottomSheet"
import Button from "../Button"
import ScaleDownPressable from "../ScaleDownPressable"
import DateSection from "./DateSection"

import CrossIcon from "../../../assets/icons/hero-icons/x-mark.svg"
import WalletIcon from "../../../assets/icons/wallet-duo.svg"
import NoteIcon from "../../../assets/icons/note-duo-dark.svg"

// const snapPoints = ["25%", "94%"]
// 184 = handle + header + payee + fund height
const snapPoints = [184, "94%"]
const backgroundColor = mauveDark.mauve2

const TransactionCreateBottomSheet = forwardRef<BottomSheet>((_, ref) => {
  const springConfig = useBottomSheetSpringConfigs({
    damping: 80,
    stiffness: 350,
  })

  const { dismissAll } = useBottomSheetModal()

  const [note, setNote] = useState("")
  const createdDate = useRef(new Date())

  return (
    <BottomSheet
      snapPoints={snapPoints}
      stackBehavior="push"
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
      <View className="flex-1">
        <View className="flex-row items-center justify-between px-4">
          <ScaleDownPressable onPress={dismissAll}>
            <CrossIcon
              color={mauveDark.mauve12}
              width={20}
              height={20}
              strokeWidth={3}
            />
          </ScaleDownPressable>

          <Button>
            <Text className="font-satoshi-medium text-mauve12 text-base">
              Save
            </Text>
          </Button>
        </View>

        <View className="border-b-mauveDark4 h-16 flex-row items-center border-b px-4">
          <View className="aspect-square w-5" />
          <TextInput
            className="font-satoshi-medium text-mauveDark12 ml-4 h-full grow text-xl"
            placeholder="Store or Item"
            placeholderTextColor={mauveDark.mauve10}
          />
        </View>

        <View className="border-b-mauveDark4 h-16 flex-row items-center border-b px-4">
          <WalletIcon width={20} height={20} />
          <TextInput
            className="font-satoshi-medium text-mauveDark12 ml-4 h-full grow"
            style={{ fontSize: 16 }}
            placeholder="Select Fund"
            placeholderTextColor={mauveDark.mauve10}
          />
        </View>

        <DateSection createdDate={createdDate} />

        <View className="border-b-mauveDark4 h-16 flex-row items-center border-b px-4">
          <NoteIcon width={20} height={20} />
          <TextInput
            className="font-satoshi-medium text-mauveDark12 ml-4 h-full grow"
            style={{ fontSize: 16 }}
            placeholder="Add Note"
            placeholderTextColor={mauveDark.mauve10}
            value={note}
            onChangeText={setNote}
          />
        </View>
      </View>
    </BottomSheet>
  )
})
TransactionCreateBottomSheet.displayName = "TransactionCreateBottomSheet"

function CustomBackdrop(props: ComponentProps<typeof Backdrop>) {
  const { animatedIndex } = props

  const containerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      animatedIndex.value,
      [-1, 0, 1],
      [0, 0.2, 1],
      Extrapolate.CLAMP,
    ),
  }))

  return (
    <Backdrop
      {...props}
      appearsOnIndex={1}
      disappearsOnIndex={-1}
      opacity={1}
      style={[{ backgroundColor }, props.style, containerAnimatedStyle]}
    />
  )
}

function CustomBackground({ animatedIndex, style }: BottomSheetBackdropProps) {
  const containerAnimatedStyle = useBackgroundColor(animatedIndex)
  const containerStyle = useMemo(
    () => [style, containerAnimatedStyle],
    [style, containerAnimatedStyle],
  )

  return <Animated.View pointerEvents="none" style={containerStyle} />
}

function CustomHandle({ animatedIndex }: BottomSheetHandleProps) {
  const containerAnimatedStyle = useBackgroundColor(animatedIndex)
  const containerStyle = useMemo(
    () => [containerAnimatedStyle],
    [containerAnimatedStyle],
  )

  return (
    <Animated.View
      pointerEvents="none"
      style={containerStyle}
      className="h-6 items-center justify-center"
    >
      <View className="bg-mauveDark8 h-1 w-[27px] rounded-full" />
    </Animated.View>
  )
}

function useBackgroundColor(animatedIndex: SharedValue<number>) {
  return useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      animatedIndex.value,
      [0, 1],
      [mauveDark.mauve3, backgroundColor],
    ),
  }))
}

export type TransactionCreateBottomSheet = BottomSheet
export default TransactionCreateBottomSheet
