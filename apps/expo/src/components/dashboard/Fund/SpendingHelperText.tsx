import { FC } from "react"
import { Text } from "react-native"
import { getWeekOfMonth, isThisMonth } from "date-fns"

import { FundWithMeta } from "~/types"
import { mauve, pink } from "~/utils/colors"
import { toCurrencyNarrow } from "~/utils/functions"

import { HelperTextProps } from "./HelperText"
import { TimeMode } from ".prisma/client"

const SpendingHelperText: FC<HelperTextProps> = ({ showDefault, fund }) => {
  const relativeOverspentValue = getRelativeOverspentValue(fund)
  const didRelativeOverspend = relativeOverspentValue < 0
  const didMonthlyOverspend = getDidMonthlyOverspent(fund)

  if (showDefault) {
    return (
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
              {toCurrencyNarrow(Number(fund.budgetedAmount) - fund.totalSpent)}{" "}
            </Text>
            {`left ${helperTextTimeModeMap[fund.timeMode]}`.trim()}
          </>
        )}
      </Text>
    )
  }

  return (
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
          {toCurrencyNarrow(fund.totalBudgetedAmount)}
        </Text>{" "}
        <Text className="font-nunito">
          ({Math.ceil((fund.totalSpent / fund.totalBudgetedAmount) * 100)}
          %)
        </Text>
      </>
    </Text>
  )
}

function getDidMonthlyOverspent(fund: FundWithMeta) {
  return fund.totalBudgetedAmount < fund.totalSpent
}

// relative to current date and timemode
function getRelativeOverspentValue(fund: FundWithMeta) {
  const now = new Date()

  if (fund.timeMode === "MONTHLY" || fund.timeMode === "EVENTUALLY")
    return fund.totalBudgetedAmount - fund.totalSpent
  else if (fund.timeMode === "WEEKLY") {
    const weekOfMonth = getWeekOfMonth(now)
    if (isThisMonth(fund.createdAt || now)) {
      return (
        (getWeekOfMonth(now) - getWeekOfMonth(fund.createdAt || now) + 1) *
          Number(fund.budgetedAmount) -
        fund.totalSpent
      )
    }
    return weekOfMonth * Number(fund.budgetedAmount) - fund.totalSpent
  }

  return (
    (Number(!(now.getDate() < 15)) + 1) * Number(fund.budgetedAmount) -
    fund.totalSpent
  )
}

const helperTextTimeModeMap: Record<TimeMode, string> = {
  WEEKLY: "this week",
  MONTHLY: "this month",
  BIMONTHLY: "",
  EVENTUALLY: "",
}

export default SpendingHelperText
