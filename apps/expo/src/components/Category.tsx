import { View, Text, ViewProps } from "react-native"
import clsx from "clsx"
import { getWeeksInMonth } from "date-fns"

import { range, toCurrency } from "~/utils/functions"
import { Fund, TimeMode } from ".prisma/client"
import ProgressBar from "./ProgressBar"

import Stripes from "@assets/icons/stripes-small.svg"

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
  console.log(getWeeksInMonth(new Date()))
  const fundProgress = useFundProgress(fund, totalSpent)

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

      <View className="mt-2 flex-row gap-x-1">
        {fundProgress.map((progress, index) => (
          <CategoryProgressBar
            key={index.toString() + fund.id}
            progress={progress}
          />
        ))}
      </View>
    </View>
  )
}

function CategoryProgressBar({
  className,
  style,
  progress,
}: Pick<ViewProps, "className" | "style"> & { progress: number }) {
  return (
    <ProgressBar
      progress={progress}
      Stripes={Stripes}
      // className={clsx("bg-violet6 flex-1 rounded-full", className)}
      className={clsx("flex-1 rounded-full", className)}
      // className={clsx("flex-1 rounded-full", className)}
      // color="violet5"
      style={style}
    />
  )
}

function useFundProgress(fund: Fund, totalSpent: number) {
  const progressBarsPerTimeMode: Record<TimeMode, number> = {
    WEEKLY: getWeeksInMonth(new Date()),
    BIMONTHLY: 2,
    MONTHLY: 1,
    EVENTUALLY: 1,
  }

  const budgetedAmount = Number(fund.budgetedAmount)
  let left = totalSpent
  const progresses: number[] = []
  for (const _ of range(progressBarsPerTimeMode[fund.timeMode])) {
    if (left >= budgetedAmount) {
      progresses.push(0)
      left -= budgetedAmount
    } else {
      progresses.push(100 - (left / budgetedAmount) * 100)
      left = 0
    }
  }

  return progresses.reverse()
}
