import { useRef } from "react"
import { View, Text } from "react-native"
import { BottomSheetModal } from "@gorhom/bottom-sheet"

import { FundWithMeta } from "~/types"

import ScaleDownPressable from "./ScaleDownPressable"
import FundDetailBottomSheet from "./fund-detail/FundDetailBottomSheet"

import HelperText from "./dashboard/Fund/HelperText"
import CategoryProgressBars from "./dashboard/Fund/CategoryProgressBars"

export const CATEGORY_HEIGHT = 56

type CategoryProps = {
  fund: FundWithMeta
}

export default function Category({ fund }: CategoryProps) {
  const ref = useRef<BottomSheetModal>(null)

  const ProgressBars = CategoryProgressBars[fund.fundType]

  return (
    <>
      <ScaleDownPressable
        className="justify-center px-4"
        style={{ height: CATEGORY_HEIGHT }}
        onPress={() => {
          ref.current?.present()
        }}
      >
        <View className="flex-row justify-between">
          <Text className="font-satoshi-medium text-violet12 text-base">
            {fund.name}
          </Text>

          <HelperText fund={fund} />
        </View>

        <ProgressBars fund={fund} />
      </ScaleDownPressable>
      {/* FIX: bottom sheet re-showing up after closing */}
      <FundDetailBottomSheet ref={ref} fund={fund} />
    </>
  )
}
