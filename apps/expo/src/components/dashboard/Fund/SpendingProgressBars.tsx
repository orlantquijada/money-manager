import { useMemo } from "react"
import { View } from "react-native"
import { getWeekOfMonth, getWeeksInMonth, isThisMonth } from "date-fns"

import ProgressBar from "~/components/ProgressBar"
import { daysInCurrentMonth } from "~/utils/constants"
import { FundWithMeta } from "~/types"
import { pink, violet } from "~/utils/colors"

import Stripes from "@assets/icons/stripes-small-violet.svg"
import PinkStripes from "@assets/icons/stripes-pink.svg"

import { Fund, TimeMode } from ".prisma/client"

export default function SpendingProgressBars({ fund }: { fund: FundWithMeta }) {
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
          color={violet.violet6}
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

function useFundProgress(fund: Fund, totalSpent: number) {
  return useMemo(() => {
    const bars = getNumberOfBars(fund)

    const budgetProgress: number[] = []
    const budgetedAmount = Number(fund.budgetedAmount)
    let left = totalSpent
    for (let i = bars - 1; i >= 0; i--) {
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

function getNumberOfBars(fund: Fund) {
  const now = new Date()
  const bars: Record<TimeMode, number> = {
    WEEKLY:
      fund.createdAt && isThisMonth(fund.createdAt)
        ? getWeeksInMonth(now) - getWeekOfMonth(fund.createdAt) + 1
        : getWeeksInMonth(now),
    BIMONTHLY:
      fund.createdAt &&
      isThisMonth(fund.createdAt) &&
      fund.createdAt.getDate() > daysInCurrentMonth / 2
        ? 1
        : 2,
    MONTHLY: 1,
    EVENTUALLY: 1,
  }

  return bars[fund.timeMode]
}

function getShouldHighlight(fund: Fund, index: number) {
  if (fund.timeMode === "MONTHLY" || fund.timeMode === "EVENTUALLY")
    return false

  const bars = getNumberOfBars(fund)
  if (bars === 1) return false

  const now = new Date()
  if (fund.timeMode === "WEEKLY") {
    return isThisMonth(fund.createdAt || now)
      ? getWeekOfMonth(now) - getWeekOfMonth(fund.createdAt || now) + 1 ===
          index
      : getWeekOfMonth(now) === index
  }

  return now.getDate() < daysInCurrentMonth / 2 === !(index - 1)
}
