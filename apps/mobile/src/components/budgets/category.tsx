import { Link } from "expo-router";
import { useMemo } from "react";
import { Pressable, useWindowDimensions } from "react-native";
import LeanText from "@/components/lean-text";
import LeanView from "@/components/lean-view";
import type { FundWithMeta } from "@/lib/fund";
import { getTimeModeMultiplier } from "@/lib/fund";
import ProgressBar from "./progress-bar";
import QuickStatSpending from "./quick-stat/spending";

export const CATEGORY_HEIGHT = 56;

type CategoryProps = {
  fund: FundWithMeta;
};

/**
 * Calculates progress for each bar based on total spending.
 * Distributes spending from the current period backwards.
 * Returns progress as 0-1 values where 1 = full (nothing spent), 0 = empty (fully spent).
 */
function useFundProgress(fund: FundWithMeta) {
  return useMemo(() => {
    const barCount = getTimeModeMultiplier(fund.timeMode);
    const budgetedAmount = fund.budgetedAmount;

    const progressBars: number[] = [];
    let remaining = fund.totalSpent;

    // Fill bars from the end (current period) to the start (oldest period)
    for (let i = barCount - 1; i >= 0; i--) {
      if (remaining >= budgetedAmount) {
        progressBars[i] = 0; // Fully spent
        remaining -= budgetedAmount;
      } else {
        progressBars[i] = 1 - remaining / budgetedAmount; // Partially spent
        remaining = 0;
      }
    }

    const overspentRatio = remaining / budgetedAmount;

    return { progressBars, overspentRatio };
  }, [fund.timeMode, fund.budgetedAmount, fund.totalSpent]);
}

export default function Category({ fund }: CategoryProps) {
  const { width: deviceWidth } = useWindowDimensions();

  const barCount = getTimeModeMultiplier(fund.timeMode);
  const barWidth = deviceWidth / barCount;
  const { progressBars } = useFundProgress(fund);

  return (
    <Link asChild href={{ pathname: "/fund/[id]", params: { id: fund.id } }}>
      <Pressable
        className="justify-center gap-2 px-4 transition-all active:scale-[.98] active:opacity-70"
        style={{ height: CATEGORY_HEIGHT }}
      >
        <LeanView className="flex-row items-center justify-between gap-3">
          <LeanText
            className="shrink font-satoshi-medium text-base text-foreground"
            ellipsizeMode="tail"
            numberOfLines={1}
          >
            {fund.name}
          </LeanText>

          <QuickStatSpending fund={fund} />
        </LeanView>

        <LeanView className="flex-row gap-2">
          {progressBars.map((progress, index) => {
            const isCurrentPeriod = index === barCount - 1;

            return (
              <ProgressBar
                barWidth={barWidth}
                highlight={barCount > 1 ? isCurrentPeriod : false}
                key={index}
                progress={progress}
              />
            );
          })}
        </LeanView>
      </Pressable>
    </Link>
  );
}
