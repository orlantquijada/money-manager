import { FC } from "react"
import { Text } from "react-native"
import { getWeekOfMonth, isThisMonth } from "date-fns"

import { FundWithMeta } from "~/types"
import { mauve, pink } from "~/utils/colors"
import { toCurrencyNarrow } from "~/utils/functions"

import { HelperTextProps } from "./HelperText"
import { TimeMode } from ".prisma/client"

// TODO: this
const SpendingHelperText: FC<HelperTextProps> = ({ fund }) => {
  const relativeAmountLeft = getRelativeAmountLeft(fund)
  const didRelativeOverspend = relativeAmountLeft < 0

  return (
    <Text className="font-satoshi text-mauve9 text-sm">
      <Text className="font-nunito-semibold">
        {toCurrencyNarrow(fund.totalBudgetedAmount - fund.totalSpent)}
      </Text>{" "}
      Available for spending
    </Text>
  )
}

function getDidMonthlyOverspent(fund: FundWithMeta) {
  return fund.totalBudgetedAmount < fund.totalSpent
}

// relative to current date and timemode
function getRelativeAmountLeft(fund: FundWithMeta) {
  const now = new Date()

  if (fund.timeMode === "MONTHLY" || fund.timeMode === "EVENTUALLY")
    return fund.totalBudgetedAmount - fund.totalSpent
  else if (fund.timeMode === "WEEKLY") {
    const weekOfMonth = getWeekOfMonth(now)
    if (isThisMonth(fund.createdAt || now)) {
      return (
        (weekOfMonth - getWeekOfMonth(fund.createdAt || now) + 1) *
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
