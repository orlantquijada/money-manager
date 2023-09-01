import { View } from "react-native"

import { FundWithMeta } from "~/types"

import ProgressBar from "~/components/ProgressBar"

import Stripes from "@assets/icons/stripes-amber.svg"

export default function TargetProgressBars({ fund }: { fund: FundWithMeta }) {
  const fundProgress = useFundProgress(fund, fund.totalSpent)

  return (
    <View className="mt-2 flex-row gap-x-1">
      <ProgressBar
        progress={fundProgress}
        // amberDark12 90% opacity
        color={"#ffe7b3e6"}
        Stripes={
          <View className="opacity-[.15]">
            <Stripes />
          </View>
        }
        className="flex-1 rounded-full"
      />
    </View>
  )
}

function useFundProgress(fund: FundWithMeta, fundedAmount: number) {
  return (fundedAmount / Number(fund.totalBudgetedAmount)) * 100
}
