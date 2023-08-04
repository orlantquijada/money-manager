import { useMemo } from "react"
import { View, Text } from "react-native"
import { getWeeksInMonth, getWeekOfMonth } from "date-fns"
import clsx from "clsx"

import { toCurrencyNarrow } from "~/utils/functions"
import { Fund, TimeMode } from ".prisma/client"
import ProgressBar from "./ProgressBar"
import { pink } from "~/utils/colors"

import Stripes from "@assets/icons/stripes-small-violet.svg"
import PinkStripes from "@assets/icons/stripes-pink.svg"

const helperTextTimeModeMap: Record<TimeMode, string> = {
  WEEKLY: "this week",
  MONTHLY: "this month",
  BIMONTHLY: "",
  EVENTUALLY: "",
}

type CategoryProps = {
  fund: Fund
}
export default function Category({ fund }: CategoryProps) {
  const weekOfMonth = getWeekOfMonth(new Date())
  const overspentValue = weekOfMonth * Number(fund.budgetedAmount) - totalSpent
  const didOverspend = overspentValue < 0

  // console.log(overspentValue, didOverspend)
  return (
    <View className="py-2 px-4">
      <View className="flex-row justify-between">
        <Text className="font-satoshi-medium text-violet12 text-base">
          {fund.name}
        </Text>

        {/* different text format per target type */}
        <Text
          className={clsx("font-satoshi text-mauve9 mt-1 text-xs")}
          style={didOverspend ? { color: pink.pink9, opacity: 0.8 } : {}}
        >
          {/* {`${toCurrency(Math.random() * 1000)} left ${ */}
          {/*   helperTextTimeModeMap[fund.timeMode] */}
          {/* }`.trim()} */}
          {didOverspend ? (
            <>
              overspent
              <Text className="font-nunito-semibold">
                {" "}
                {toCurrencyNarrow(overspentValue * -1)}{" "}
              </Text>
              {`${helperTextTimeModeMap[fund.timeMode]}`.trim()}
            </>
          ) : (
            <>
              <Text className="font-nunito-semibold">
                {toCurrencyNarrow(Number(fund.budgetedAmount) - totalSpent)}{" "}
              </Text>
              {`left ${helperTextTimeModeMap[fund.timeMode]}`.trim()}
            </>
          )}
        </Text>
      </View>

      <CategoryProgressBar fund={fund} />
    </View>
  )
}

function CategoryProgressBar({ fund }: { fund: Fund }) {
  const [fundProgress, overspentProgress] = useFundProgress(fund, totalSpent)

  if (overspentProgress) console.log(overspentProgress, fund.name)

  return (
    <View className="mt-2 flex-row gap-x-1">
      {overspentProgress ? (
        <ProgressBar
          progress={100}
          Stripes={
            <View>
              <PinkStripes />
            </View>
          }
          className="flex-1"
          color="transparent"
          // color={pink.pink8}
          style={{ flexGrow: overspentProgress / 100 }}
        />
      ) : null}
      {fundProgress.map((progress, index) => (
        <ProgressBar
          key={index + fund.id}
          progress={progress}
          Stripes={
            <View className="opacity-[.15]">
              <Stripes />
            </View>
          }
          className={"flex-1 rounded-full"}
        />
      ))}
    </View>
  )
}

const totalSpent = 500

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

    const overspentProgress = (left / budgetedAmount) * 100

    return [budgetProgress, overspentProgress] as const
  }, [fund, totalSpent])
}
