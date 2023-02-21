import { View, Text } from "react-native"
import { getWeeksInMonth } from "date-fns"

import { toCurrency } from "~/utils/functions"
import { Fund, TimeMode } from ".prisma/client"
import ProgressBar from "./ProgressBar"

import Stripes from "@assets/icons/stripes-small-violet.svg"
import { useMemo } from "react"

const helperTextTimeModeMap: Record<TimeMode, string> = {
  WEEKLY: "this week",
  MONTHLY: "this month",
  BIMONTHLY: "",
  EVENTUALLY: "",
}

const totalSpent = 150

type CategoryProps = {
  fund: Fund
}
export default function Category({ fund }: CategoryProps) {
  return (
    <View className="py-2 px-4">
      <View className="flex-row justify-between">
        <Text className="font-satoshi-medium text-violet12 text-base">
          {fund.name}
        </Text>

        {/* different text format per target type */}
        <Text className="font-satoshi text-mauve9 mt-1 text-xs">
          {/* {`${toCurrency(Math.random() * 1000)} left ${ */}
          {/*   helperTextTimeModeMap[fund.timeMode] */}
          {/* }`.trim()} */}
          {`${toCurrency(Number(fund.budgetedAmount) - totalSpent)} left ${
            helperTextTimeModeMap[fund.timeMode]
          }`.trim()}
        </Text>
      </View>

      <CategoryProgressBar fund={fund} />
    </View>
  )
}

function CategoryProgressBar({ fund }: { fund: Fund }) {
  const fundProgress = useFundProgress(fund, totalSpent)

  return (
    <View className="mt-2 flex-row gap-x-1">
      {fundProgress.map((progress, index) => (
        <ProgressBar
          key={index + fund.id}
          progress={progress}
          Stripes={Stripes}
          className={"flex-1 rounded-full"}
        />
      ))}
    </View>
  )
}

function useFundProgress(fund: Fund, totalSpent: number) {
  return useMemo(() => {
    const progressBarsPerTimeMode: Record<TimeMode, number> = {
      WEEKLY: getWeeksInMonth(new Date()),
      BIMONTHLY: 2,
      MONTHLY: 1,
      EVENTUALLY: 1,
    }

    const budgetProgress: number[] = []
    const budgetedAmount = Number(fund.budgetedAmount)
    let left = totalSpent
    for (let i = progressBarsPerTimeMode[fund.timeMode] - 1; i >= 0; i--) {
      if (left >= budgetedAmount) {
        budgetProgress[i] = 0
        left -= budgetedAmount
      } else {
        budgetProgress[i] = 100 - (left / budgetedAmount) * 100
        left = 0
      }
    }

    return budgetProgress
  }, [fund, totalSpent])
}
