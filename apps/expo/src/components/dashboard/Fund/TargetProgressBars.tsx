import AmberStripes from "@assets/icons/stripes-amber.svg";
import { View } from "react-native";
import ProgressBar from "~/components/ProgressBar";
import type { FundWithMeta } from "~/types";
import { lime } from "~/utils/colors";
import { progressBarColors } from "~/utils/constants";

export default function TargetProgressBars({ fund }: { fund: FundWithMeta }) {
  const fundProgress = useFundProgress(fund, fund.totalSpent);
  const isOverFunded = fundProgress.length === 2;

  return (
    <View className="mt-2 flex-row gap-x-1">
      <ProgressBar
        className="flex-1 rounded-full"
        // amberDark12 90% opacity
        color={progressBarColors.TARGET}
        progress={isOverFunded ? 100 : fundProgress[0] || 0}
        Stripes={
          <View className="opacity-[.15]">
            <AmberStripes />
          </View>
        }
      />
      {isOverFunded ? (
        <ProgressBar
          className="flex-1 rounded-full"
          // color="#ffe7b3e6"
          color={lime.lime4}
          progress={100}
          Stripes={null}
          style={{ flexGrow: (fundProgress[1] || 1) / 100 }}
        />
      ) : null}
    </View>
  );
}

function useFundProgress(fund: FundWithMeta, fundedAmount: number) {
  const progress = (fundedAmount / Number(fund.totalBudgetedAmount)) * 100;
  return progress > 100 ? [100, progress - 100] : [progress];
}
