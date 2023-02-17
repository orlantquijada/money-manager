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
const progressBarsPerTimeMode: Record<TimeMode, number> = {
  WEEKLY: getWeeksInMonth(new Date()),
  BIMONTHLY: 2,
  MONTHLY: 1,
  EVENTUALLY: 1,
}

type CategoryProps = {
  fund: Fund
}
export default function Category({ fund }: CategoryProps) {
  console.log(getWeeksInMonth(new Date()))
  return (
    <View className="py-2 px-4">
      <View className="flex-row justify-between">
        <Text className="font-satoshi-medium text-violet12 text-base">
          {fund.name}
        </Text>

        {/* different text format per target type */}
        <Text className="font-satoshi text-mauve9 mt-1 text-xs">
          {`${toCurrency(Math.random() * 1000)} left ${
            helperTextTimeModeMap[fund.timeMode]
          }`.trim()}
        </Text>
      </View>

      <View className="mt-2 flex-row gap-x-1">
        {range(progressBarsPerTimeMode[fund.timeMode]).map((_, index) => (
          <CategoryProgressBar key={index.toString() + fund.id} />
        ))}
      </View>
    </View>
  )
}

function Foo({ fund, totalSpent }: { totalSpent: number; fund: Fund }) {
  return <View></View>
}

const getProgress = (fund: Fund, totalSpent: number) => {
  const progressBarFullAmount =
    fund.budgetedAmount.toNumber() / progressBarsPerTimeMode[fund.timeMode]

  return range(progressBarsPerTimeMode[fund.timeMode]).reduceRight(
    (acc, current) => {
      return acc
    },
    totalSpent,
  )
}

function CategoryProgressBar({
  className,
  style,
}: Pick<ViewProps, "className" | "style">) {
  // return (
  //   <View
  //     className={clsx(
  //       "bg-violet4 relative h-2 w-full flex-1 overflow-hidden rounded-full",
  //       className,
  //     )}
  //     style={style}
  //     onLayout={({ nativeEvent }) => {
  //       width.current = nativeEvent.layout.width
  //     }}
  //   >
  //     <View className="absolute inset-0 z-0 translate-x-full">
  //       <Stripes />
  //     </View>
  //   </View>
  // )
  //
  return (
    <ProgressBar
      progress={Math.random() * 100}
      // progress={80}
      Stripes={Stripes}
      className={clsx("bg-violet3 flex-1 rounded-full", className)}
      style={style}
    />
  )
}

// how do i calculate the total progress of a budget based on how many weeks it is divided by
// budget amount per week - 100
// total spent - 35
// weeks - 5
// result should be
// 100 100 100 100 65
//
// budgeted amount is the total amount per week na
