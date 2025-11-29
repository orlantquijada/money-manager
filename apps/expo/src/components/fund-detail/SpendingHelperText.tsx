import type { TimeMode } from ".prisma/client";
import { getWeekOfMonth, isThisMonth } from "date-fns";
import type { FC } from "react";
import { Text } from "react-native";
import type { FundWithMeta } from "~/types";
import { toCurrencyNarrow } from "~/utils/functions";
import type { HelperTextProps } from "./HelperText";

// TODO: this
const SpendingHelperText: FC<HelperTextProps> = ({ fund }) => {
  const relativeAmountLeft = getRelativeAmountLeft(fund);
  const _didRelativeOverspend = relativeAmountLeft < 0;

  return (
    <Text className="font-satoshi text-mauve9 text-sm">
      <Text className="font-nunito-semibold">
        {toCurrencyNarrow(fund.totalBudgetedAmount - fund.totalSpent)}
      </Text>{" "}
      Available for spending
    </Text>
  );
};

function _getDidMonthlyOverspent(fund: FundWithMeta) {
  return fund.totalBudgetedAmount < fund.totalSpent;
}

// relative to current date and timemode
function getRelativeAmountLeft(fund: FundWithMeta) {
  const now = new Date();

  if (fund.timeMode === "MONTHLY" || fund.timeMode === "EVENTUALLY") {
    return fund.totalBudgetedAmount - fund.totalSpent;
  }
  if (fund.timeMode === "WEEKLY") {
    const weekOfMonth = getWeekOfMonth(now);
    if (isThisMonth(fund.createdAt || now)) {
      return (
        (weekOfMonth - getWeekOfMonth(fund.createdAt || now) + 1) *
          Number(fund.budgetedAmount) -
        fund.totalSpent
      );
    }
    return weekOfMonth * Number(fund.budgetedAmount) - fund.totalSpent;
  }

  return (
    (Number(!(now.getDate() < 15)) + 1) * Number(fund.budgetedAmount) -
    fund.totalSpent
  );
}

const _helperTextTimeModeMap: Record<TimeMode, string> = {
  WEEKLY: "this week",
  MONTHLY: "this month",
  BIMONTHLY: "",
  EVENTUALLY: "",
};

export default SpendingHelperText;
