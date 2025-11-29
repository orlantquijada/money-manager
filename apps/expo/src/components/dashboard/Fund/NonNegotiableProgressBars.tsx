import Stripes from "@assets/icons/stripes-lime.svg";
import { View } from "react-native";
import ProgressBar from "~/components/ProgressBar";
import type { FundWithMeta } from "~/types";
import { progressBarColors } from "~/utils/constants";

export default function NonNegotiableProgressBars({
  fund,
}: {
  fund: FundWithMeta;
}) {
  const fundProgress = useFundProgress(fund, fund.totalSpent);

  return (
    <View className="mt-2 flex-row gap-x-1">
      <ProgressBar
        className="flex-1 rounded-full"
        color={progressBarColors.NON_NEGOTIABLE}
        progress={fundProgress}
        Stripes={
          <View className="opacity-[.15]">
            <Stripes />
          </View>
        }
      />
    </View>
  );
}

function useFundProgress(fund: FundWithMeta, fundedAmount: number) {
  return fundedAmount === Number(fund.totalBudgetedAmount) ? 100 : 0;
}
