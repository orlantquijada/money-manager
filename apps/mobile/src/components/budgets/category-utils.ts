import type { TimeMode } from "api";
import { getWeekOfMonth } from "date-fns";
import { useMemo } from "react";
import type { ColorKey } from "@/components/theme-provider";
import type { FundWithMeta } from "@/lib/fund";
import { getTimeModeMultiplier } from "@/lib/fund";

/**
 * Returns the 0-indexed position of the current period within the month.
 * - WEEKLY: Current week of the month (0 to weeks-1)
 * - BIMONTHLY: 0 for first half, 1 for second half
 * - MONTHLY/EVENTUALLY: Always 0 (single period)
 */
export function getCurrentPeriodIndex(timeMode: TimeMode): number {
  const now = new Date();
  if (timeMode === "WEEKLY") return getWeekOfMonth(now) - 1;
  if (timeMode === "BIMONTHLY") return now.getDate() <= 15 ? 0 : 1;

  // MONTHLY and EVENTUALLY have single bars
  return 0;
}

type ProgressResult = {
  progressBars: number[];
  overspentRatio: number;
  overfundedRatio: number;
};

/**
 * Calculates progress for each bar based on fund type.
 *
 * SPENDING funds: Distributes spending from the current period backwards.
 * Returns progress as 0-1 values where 1 = full (nothing spent), 0 = empty.
 *
 * NON_NEGOTIABLE funds: Shows savings accumulation toward target.
 * Returns progress as 0-1 values where 0 = empty, 1 = full (fully funded).
 */
export function useFundProgress(fund: FundWithMeta): ProgressResult {
  return useMemo(() => {
    const barCount = getTimeModeMultiplier(fund.timeMode);

    if (fund.fundType === "NON_NEGOTIABLE") {
      return calculateSavingsProgress(fund, barCount);
    }

    return calculateSpendingProgress(fund, barCount);
  }, [fund]);
}

/** NON_NEGOTIABLE: Bars fill up as user saves */
function calculateSavingsProgress(
  fund: FundWithMeta,
  barCount: number
): ProgressResult {
  const progressBars: number[] = [];
  let accumulated = fund.totalSpent;

  for (let i = 0; i < barCount; i++) {
    if (accumulated >= fund.budgetedAmount) {
      progressBars[i] = 1;
      accumulated -= fund.budgetedAmount;
    } else {
      progressBars[i] = accumulated / fund.budgetedAmount;
      accumulated = 0;
    }
  }

  return {
    progressBars,
    overspentRatio: 0,
    overfundedRatio: accumulated / fund.budgetedAmount,
  };
}

/** SPENDING: Bars deplete as user spends (from current period backwards) */
function calculateSpendingProgress(
  fund: FundWithMeta,
  barCount: number
): ProgressResult {
  const progressBars: number[] = [];
  let remaining = fund.totalSpent;

  for (let i = barCount - 1; i >= 0; i--) {
    if (remaining >= fund.budgetedAmount) {
      progressBars[i] = 0;
      remaining -= fund.budgetedAmount;
    } else {
      progressBars[i] = 1 - remaining / fund.budgetedAmount;
      remaining = 0;
    }
  }

  return {
    progressBars,
    overspentRatio: remaining / fund.budgetedAmount,
    overfundedRatio: 0,
  };
}

/** NON_NEGOTIABLE funds: color based on savings accumulation */
export function getSavingsColor(progress: number): ColorKey {
  if (progress >= 1) return "lime-4"; // Fully funded
  if (progress >= 0.5) return "lime-4"; // Good progress
  return "mauve-9"; // Muted (starting out)
}
