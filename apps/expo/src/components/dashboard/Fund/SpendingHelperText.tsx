import type { TimeMode } from ".prisma/client";
import { getWeekOfMonth, isThisMonth } from "date-fns";
import type { FC } from "react";
import { Text } from "react-native";
import type { FundWithMeta } from "~/types";
import { mauve, pink } from "~/utils/colors";
import { toCurrencyNarrow } from "~/utils/functions";
import type { HelperTextProps } from "./HelperText";

const SpendingHelperText: FC<HelperTextProps> = ({ showDefault, fund }) => {
  const relativeAmountLeft = getRelativeAmountLeft(fund);
  const didRelativeOverspend = relativeAmountLeft < 0;

  if (showDefault) {
    return (
      <Text
        className="mt-1 font-satoshi text-xs"
        style={{ color: didRelativeOverspend ? pink.pink8 : mauve.mauve9 }}
      >
        {didRelativeOverspend ? (
          <>
            overspent
            <Text className="font-nunito-semibold">
              {" "}
              {toCurrencyNarrow(relativeAmountLeft * -1)}{" "}
            </Text>
            {`${helperTextTimeModeMap[fund.timeMode]}`.trim()}
          </>
        ) : (
          <>
            <Text className="font-nunito-semibold">
              {toCurrencyNarrow(relativeAmountLeft)}{" "}
            </Text>
            {`left ${helperTextTimeModeMap[fund.timeMode]}`.trim()}
          </>
        )}
      </Text>
    );
  }

  const didMonthlyOverspend = getDidMonthlyOverspent(fund);

  return (
    <Text
      className="mt-1 font-satoshi text-xs"
      style={{ color: didMonthlyOverspend ? pink.pink8 : mauve.mauve9 }}
    >
      spent
      <Text className="font-nunito"> {toCurrencyNarrow(fund.totalSpent)} </Text>
      of
      <Text className="font-nunito-semibold">
        {" "}
        {toCurrencyNarrow(fund.totalBudgetedAmount)}
      </Text>{" "}
      <Text className="font-nunito">
        ({Math.ceil((fund.totalSpent / fund.totalBudgetedAmount) * 100)}
        %)
      </Text>
    </Text>
  );
};

function getDidMonthlyOverspent(fund: FundWithMeta) {
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

const helperTextTimeModeMap: Record<TimeMode, string> = {
  WEEKLY: "this week",
  MONTHLY: "this month",
  BIMONTHLY: "",
  EVENTUALLY: "",
};

export default SpendingHelperText;
