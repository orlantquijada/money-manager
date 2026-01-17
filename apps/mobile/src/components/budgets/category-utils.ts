import type { TimeMode } from "api";
import { getWeekOfMonth } from "date-fns";
import { useMemo } from "react";
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

type RollingProgressResult = {
  /** 0-1 value: portion of budget remaining */
  progress: number;
  /** Ratio of overspent amount to single period budget (for red bar sizing) */
  overspentRatio: number;
  /** Ratio of overfunded amount to single period budget (for NON_NEGOTIABLE) */
  overfundedRatio: number;
};

/**
 * Calculates rolling budget progress for a single consolidated bar.
 *
 * Rolling logic: Budget accumulates across periods. If you underspend in
 * Week 1, that surplus rolls into Week 2's available budget.
 *
 * SPENDING funds: progress = remaining / budgetThroughNow
 * NON_NEGOTIABLE funds: progress = saved / monthlyTarget
 */
export function useRollingProgress(fund: FundWithMeta): RollingProgressResult {
  return useMemo(() => {
    if (fund.fundType === "NON_NEGOTIABLE") {
      return calculateRollingSavings(fund);
    }
    return calculateRollingSpending(fund);
  }, [fund]);
}

/** SPENDING: Single bar showing rolling remaining budget */
function calculateRollingSpending(fund: FundWithMeta): RollingProgressResult {
  const currentPeriodIndex = getCurrentPeriodIndex(fund.timeMode);
  const budgetThroughNow = fund.budgetedAmount * (currentPeriodIndex + 1);
  const rollingRemaining = budgetThroughNow - fund.totalSpent;

  if (rollingRemaining < 0) {
    // Overspent: bar is empty, show red overspent segment
    return {
      progress: 0,
      overspentRatio: Math.abs(rollingRemaining) / fund.budgetedAmount,
      overfundedRatio: 0,
    };
  }

  return {
    progress: budgetThroughNow > 0 ? rollingRemaining / budgetThroughNow : 1,
    overspentRatio: 0,
    overfundedRatio: 0,
  };
}

/** NON_NEGOTIABLE: Single bar showing savings toward monthly target */
function calculateRollingSavings(fund: FundWithMeta): RollingProgressResult {
  const monthlyTarget =
    fund.budgetedAmount * getTimeModeMultiplier(fund.timeMode);
  const amountSaved = fund.totalSpent;

  if (amountSaved >= monthlyTarget) {
    // Fully funded, show overfunded ratio if exceeded
    return {
      progress: 1,
      overspentRatio: 0,
      overfundedRatio: (amountSaved - monthlyTarget) / fund.budgetedAmount,
    };
  }

  return {
    progress: monthlyTarget > 0 ? amountSaved / monthlyTarget : 0,
    overspentRatio: 0,
    overfundedRatio: 0,
  };
}
