import { ComponentProps, forwardRef } from "react"
import { Text, View } from "react-native"
import { useBottomSheetSpringConfigs } from "@gorhom/bottom-sheet"

import { mauveDark } from "~/utils/colors"

import BottomSheet, { Backdrop } from "../BottomSheet"
import {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated"

const snapPoints = ["25%", "94%"]
const backgroundColor = mauveDark.mauve2

const TransactionCreateBottomSheet = forwardRef<BottomSheet>((_, ref) => {
  // const { dismissAll } = useBottomSheetModal()

  //   dismissAll()
  // }
  const springConfig = useBottomSheetSpringConfigs({
    damping: 80,
    stiffness: 350,
  })

  return (
    <BottomSheet
      snapPoints={snapPoints}
      backdropComponent={CreateBackdrop}
      ref={ref}
      index={1}
      handleIndicatorStyle={{ backgroundColor: mauveDark.mauve8 }}
      handleStyle={{ backgroundColor }}
      animationConfigs={springConfig}
      name="transaction-create"
    >
      <View
        className="flex-1 border-t px-4"
        style={{ backgroundColor, borderTopColor: backgroundColor }}
      >
        <Text className="text-mauveDark12 font-satoshi-medium text-2xl">
          Hello World
        </Text>
      </View>
    </BottomSheet>
  )
})
TransactionCreateBottomSheet.displayName = "TransactionCreateBottomSheet"

function CreateBackdrop(props: ComponentProps<typeof Backdrop>) {
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

export type TransactionCreateBottomSheet = BottomSheet
export default TransactionCreateBottomSheet
