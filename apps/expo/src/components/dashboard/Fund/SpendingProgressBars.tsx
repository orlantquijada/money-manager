import type { Fund, TimeMode } from "api";
// import PinkStripes from "@assets/icons/stripes-pink.svg";
// import Stripes from "@assets/icons/stripes-small-violet.svg";
import { getWeekOfMonth, getWeeksInMonth, isThisMonth } from "date-fns";
import { useMemo } from "react";
import { View } from "react-native";
import ProgressBar from "~/components/ProgressBar";
import type { FundWithMeta } from "~/types";
import { pink } from "~/utils/colors";
import { daysInCurrentMonth, progressBarColors } from "~/utils/constants";
import { usePrevious } from "~/utils/hooks/usePrevious";

export default function SpendingProgressBars({ fund }: { fund: FundWithMeta }) {
  const [fundProgress, overspentProgress] = useFundProgress(
    fund,
    fund.totalSpent
  );
  const prevNumOfNonEmptyBars =
    usePrevious(fundProgress.filter(Boolean).length) || fundProgress.length;

  return (
    <View className="mt-2 flex-row gap-x-1">
      {overspentProgress ? (
        <ProgressBar
          className="flex-1"
          color={pink.pink8}
          progress={100}
          Stripes={<View>{/* <PinkStripes /> */}</View>}
          style={{ flexGrow: overspentProgress / 100 }}
        />
      ) : null}
      {fundProgress.map((progress, index) => (
        <ProgressBar
          className="flex-1 rounded-full"
          color={progressBarColors.SPENDING}
          delayMultiplier={Math.max(prevNumOfNonEmptyBars - index - 1, 0)}
          highlight={getShouldHighlight(fund, fundProgress.length - index)}
          key={index + fund.id}
          progress={progress}
          Stripes={<View className="opacity-[.15]">{/* <Stripes /> */}</View>}
        />
      ))}
    </View>
  );
}

function useFundProgress(fund: Fund, totalSpent: number) {
  return useMemo(() => {
    const bars = getNumberOfBars(fund);

    const budgetProgress: number[] = [];
    const budgetedAmount = Number(fund.budgetedAmount);
    let left = totalSpent;
    for (let i = bars - 1; i >= 0; i--) {
      if (left >= budgetedAmount) {
        budgetProgress[i] = 0;
        left -= budgetedAmount;
      } else {
        budgetProgress[i] = 100 - (left / budgetedAmount) * 100;
        left = 0;
      }
    }

    const overspentProgress = (left / budgetedAmount) * 100;

    return [budgetProgress, overspentProgress] as const;
  }, [fund, totalSpent]);
}

function getNumberOfBars(fund: Fund) {
  const now = new Date();
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
  };

  return bars[fund.timeMode];
}

function getShouldHighlight(fund: Fund, index: number) {
  if (fund.timeMode === "MONTHLY" || fund.timeMode === "EVENTUALLY") {
    return false;
  }

  const bars = getNumberOfBars(fund);
  if (bars === 1) {
    return false;
  }

  const now = new Date();
  if (fund.timeMode === "WEEKLY") {
    return isThisMonth(fund.createdAt || now)
      ? getWeekOfMonth(now) - getWeekOfMonth(fund.createdAt || now) + 1 ===
          index
      : getWeekOfMonth(now) === index;
  }

  return now.getDate() < daysInCurrentMonth / 2 === !(index - 1);
}
