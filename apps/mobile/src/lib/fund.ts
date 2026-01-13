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

  // NON_NEGOTIABLE funds: show savings accumulation (0→100%)
  // Progress bar fills up as user allocates money toward the bill
  if (fund.fundType === "NON_NEGOTIABLE") {
    const amountSaved = fund.totalSpent; // Money allocated toward this bill
    const savingsProgress =
      monthlyBudget > 0 ? Math.min(amountSaved / monthlyBudget, 1) : 0;
    const isFunded = amountSaved >= monthlyBudget;

    return {
      ...fund,
      monthlyBudget,
      amountLeft,
      progress: savingsProgress, // Reuse progress for UI compatibility
      amountSaved,
      savingsProgress,
      isFunded,
      isCompleted: isFunded,
    };
  }

  // SPENDING funds: show spending depletion (100%→0%)
  // Progress bar empties as user spends money
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
