import { useMemo } from "react"
import { View, Text, Pressable } from "react-native"
import { getWeeksInMonth, getWeekOfMonth } from "date-fns"

import { getTotalBudgetedAmount, toCurrencyNarrow } from "~/utils/functions"
import { Fund, TimeMode } from ".prisma/client"
import ProgressBar from "./ProgressBar"
import { mauve, pink } from "~/utils/colors"

import Stripes from "@assets/icons/stripes-small-violet.svg"
import PinkStripes from "@assets/icons/stripes-pink.svg"
import useToggle from "~/utils/hooks/useToggle"

type FundWithTotalSpent = Fund & { totalSpent: number }
type CategoryProps = {
  fund: FundWithTotalSpent
}
export default function Category({ fund }: CategoryProps) {
  return (
    <View className="py-2 px-4">
      <View className="flex-row justify-between">
        <Text className="font-satoshi-medium text-violet12 text-base">
          {fund.name}
        </Text>

        <HelperText fund={fund} />
      </View>

      <CategoryProgressBar fund={fund} />
    </View>
  )
}

function HelperText({ fund }: { fund: FundWithTotalSpent }) {
  const relativeOverspentValue = useMemo(
    () => getRelativeOverspentValue(fund),
    [fund],
  )
  const didRelativeOverspend = relativeOverspentValue < 0

  const didMonthlyOverspend = useMemo(
    () => getDidMonthlyOverspent(fund),
    [fund],
  )

  const [showDefault, { toggle }] = useToggle(true)

  return (
    <Pressable onPress={toggle} hitSlop={20}>
      {showDefault ? (
        <Text
          className="font-satoshi mt-1 text-xs"
          style={{ color: didRelativeOverspend ? pink.pink8 : mauve.mauve9 }}
        >
          {didRelativeOverspend ? (
            <>
              overspent
              <Text className="font-nunito-semibold">
                {" "}
                {toCurrencyNarrow(relativeOverspentValue * -1)}{" "}
              </Text>
              {`${helperTextTimeModeMap[fund.timeMode]}`.trim()}
            </>
          ) : (
            <>
              <Text className="font-nunito-semibold">
                {toCurrencyNarrow(
                  Number(fund.budgetedAmount) - fund.totalSpent,
                )}{" "}
              </Text>
              {`left ${helperTextTimeModeMap[fund.timeMode]}`.trim()}
            </>
          )}
        </Text>
      ) : (
        <Text
          className="font-satoshi mt-1 text-xs"
          style={{ color: didMonthlyOverspend ? pink.pink8 : mauve.mauve9 }}
        >
          <>
            spent
            <Text className="font-nunito">
              {" "}
              {toCurrencyNarrow(fund.totalSpent)}{" "}
            </Text>
            of
            <Text className="font-nunito-semibold">
              {" "}
              {toCurrencyNarrow(getTotalBudgetedAmount(fund))}
            </Text>
          </>
        </Text>
      )}
    </Pressable>
  )
}

function CategoryProgressBar({ fund }: { fund: FundWithTotalSpent }) {
  const [fundProgress, overspentProgress] = useFundProgress(
    fund,
    fund.totalSpent,
  )

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
          // color="transparent"
          color={pink.pink8}
          style={{ flexGrow: overspentProgress / 100 }}
        />
      ) : null}
      {fundProgress.map((progress, index) => (
        <ProgressBar
          key={index + fund.id}
          progress={progress}
          highlight={getShouldHighlight(fund, fundProgress.length - index)}
          delayMultiplier={fundProgress.length - index}
          Stripes={
            <View className="opacity-[.15]">
              <Stripes />
            </View>
          }
          className="flex-1 rounded-full"
        />
      ))}
    </View>
  )
}

function getDidMonthlyOverspent(fund: FundWithTotalSpent) {
  return getTotalBudgetedAmount(fund) < fund.totalSpent
}

// relative to current date and timemode
function getRelativeOverspentValue(fund: FundWithTotalSpent) {
  const budgetedAmount = getTotalBudgetedAmount(fund)

  if (fund.timeMode === "MONTHLY" || fund.timeMode === "EVENTUALLY")
    return budgetedAmount - fund.totalSpent
  else if (fund.timeMode === "WEEKLY") {
    const weekOfMonth = getWeekOfMonth(new Date())
    return weekOfMonth * Number(fund.budgetedAmount) - fund.totalSpent
  }

  return (
    (Number(!(new Date().getDay() < 15)) + 1) * Number(fund.budgetedAmount) -
    fund.totalSpent
  )
}

const helperTextTimeModeMap: Record<TimeMode, string> = {
  WEEKLY: "this week",
  MONTHLY: "this month",
  BIMONTHLY: "",
  EVENTUALLY: "",
}

function getShouldHighlight(fund: Fund, index: number) {
  if (fund.timeMode === "MONTHLY" || fund.timeMode === "EVENTUALLY")
    return false

  if (fund.timeMode === "WEEKLY") return getWeekOfMonth(new Date()) === index

  return new Date().getDay() < 15 === !(index - 1)
}

function useFundProgress(fund: Fund, totalSpent: number) {
  // TODO: number of progress bars depend on when the fund was created
  // if fund was created on the 2nd week of the month, given that there are 5 weeks in that month,
  // there should only be 4 progress bars shown

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
