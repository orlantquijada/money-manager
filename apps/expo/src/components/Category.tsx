import type { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useRef } from "react";
import { Text, View } from "react-native";

import type { FundWithMeta } from "~/types";
import CategoryProgressBars from "./dashboard/Fund/CategoryProgressBars";
import HelperText from "./dashboard/Fund/HelperText";
import FundDetailBottomSheet from "./fund-detail/FundDetailBottomSheet";
import ScaleDownPressable from "./ScaleDownPressable";

export const CATEGORY_HEIGHT = 56;

type CategoryProps = {
  fund: FundWithMeta;
};

export default function Category({ fund }: CategoryProps) {
  const ref = useRef<BottomSheetModal>(null);

  const ProgressBars = CategoryProgressBars[fund.fundType];

  return (
    <>
      <ScaleDownPressable
        className="justify-center px-4"
        onPress={() => {
          ref.current?.present();
        }}
        style={{ height: CATEGORY_HEIGHT }}
      >
        <View className="flex-row justify-between">
          <Text className="font-satoshi-medium text-base text-violet12">
            {fund.name}
          </Text>

          <HelperText fund={fund} />
        </View>

        <ProgressBars fund={fund} />
      </ScaleDownPressable>
      {/* FIX: bottom sheet re-showing up after closing */}
      <FundDetailBottomSheet fund={fund} ref={ref} />
    </>
  );
}
