import type { RouterOutputs, TimeMode } from "api";
import { getWeeksInMonth } from "date-fns";

const TIME_MODE_MULTIPLIERS: Record<TimeMode, number | (() => number)> = {
  WEEKLY: () => getWeeksInMonth(new Date()),
  BIMONTHLY: 2,
  MONTHLY: 1,
  EVENTUALLY: 1,
};

export const TIME_MODE_LABELS: Record<TimeMode, string> = {
  WEEKLY: "this week",
  BIMONTHLY: "this 2 weeks",
  MONTHLY: "this month",
  EVENTUALLY: "left",
};

export type FolderWithMeta = RouterOutputs["folder"]["listWithFunds"][number];
export type FundWithMeta = FolderWithMeta["funds"][number];

export function getTimeModeMultiplier(timeMode: TimeMode) {
  const multiplier = TIME_MODE_MULTIPLIERS[timeMode];
  return typeof multiplier === "function" ? multiplier() : multiplier;
}

export function getMonthlyBudget(fund: FundWithMeta) {
  return fund.budgetedAmount * getTimeModeMultiplier(fund.timeMode);
}

export function fundWithMeta(fund: FundWithMeta) {
  const monthlyBudget = getMonthlyBudget(fund);
  const amountLeft = Math.max(monthlyBudget - fund.totalSpent, 0);
  const progress =
    monthlyBudget > 0 ? Math.min(fund.totalSpent / monthlyBudget, 1) : 0;

  return {
    ...fund,
    monthlyBudget,
    amountLeft,
    progress,
    isCompleted: fund.totalSpent >= monthlyBudget,
  };
}
