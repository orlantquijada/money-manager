import { Link } from "expo-router";
import { useMemo } from "react";
import { useColorScheme } from "react-native";
import { ScalePressable } from "@/components/scale-pressable";
import { useThemeColor } from "@/components/theme-provider";
import { StyledLeanText, StyledLeanView } from "@/config/interop";
import Check from "@/icons/check";
import type { FundWithMeta } from "@/lib/fund";
import { getTimeModeMultiplier } from "@/lib/fund";
import {
  green,
  greenDark,
  lime,
  limeDark,
  mauve,
  mauveDark,
} from "@/utils/colors";
import ProgressBar from "./progress-bar";
import QuickStatSpending from "./quick-stat/spending";

export const CATEGORY_HEIGHT = 56;

type CategoryProps = {
  fund: FundWithMeta;
};

/**
 * Calculates progress for each bar based on fund type.
 *
 * SPENDING funds: Distributes spending from the current period backwards.
 * Returns progress as 0-1 values where 1 = full (nothing spent), 0 = empty (fully spent).
 *
 * NON_NEGOTIABLE funds: Shows savings accumulation toward target.
 * Returns progress as 0-1 values where 0 = empty (nothing saved), 1 = full (fully funded).
 */
function useFundProgress(fund: FundWithMeta) {
  return useMemo(() => {
    const barCount = getTimeModeMultiplier(fund.timeMode);
    const budgetedAmount = fund.budgetedAmount;

    // NON_NEGOTIABLE: Savings accumulation (bar fills up as user saves)
    if (fund.fundType === "NON_NEGOTIABLE") {
      const progressBars: number[] = [];
      let accumulated = fund.totalSpent;

      // Fill bars from the start as user saves
      for (let i = 0; i < barCount; i++) {
        if (accumulated >= budgetedAmount) {
          progressBars[i] = 1; // Fully funded
          accumulated -= budgetedAmount;
        } else {
          progressBars[i] = accumulated / budgetedAmount; // Partially funded
          accumulated = 0;
        }
      }

      // Overfunded ratio (extra beyond 100%)
      const overfundedRatio = accumulated / budgetedAmount;

      return { progressBars, overspentRatio: 0, overfundedRatio };
    }

    // SPENDING: Spending depletion (bar empties as user spends)
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

    return { progressBars, overspentRatio, overfundedRatio: 0 };
  }, [fund.timeMode, fund.budgetedAmount, fund.totalSpent, fund.fundType]);
}

// NON_NEGOTIABLE funds: color based on savings accumulation (muted → lime → green)
function getSavingsColor(progress: number, isDark: boolean) {
  if (progress >= 1) {
    return isDark ? greenDark.green9 : green.green9; // Fully funded
  }
  if (progress >= 0.5) {
    return isDark ? limeDark.lime9 : lime.lime9; // Good progress
  }
  return isDark ? mauveDark.mauve9 : mauve.mauve9; // Muted (starting out)
}

export default function Category({ fund }: CategoryProps) {
  const destructiveColor = useThemeColor("destructive");
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const barCount = getTimeModeMultiplier(fund.timeMode);
  const { progressBars, overspentRatio } = useFundProgress(fund);
  const isNonNegotiable = fund.fundType === "NON_NEGOTIABLE";

  // For NON_NEGOTIABLE, use savings color based on overall progress
  const overallProgress = fund.totalSpent / (fund.budgetedAmount * barCount);
  const isFunded = isNonNegotiable && overallProgress >= 1;
  const savingsColor = isNonNegotiable
    ? getSavingsColor(overallProgress, isDark)
    : undefined;

  return (
    <Link asChild href={{ pathname: "/fund/[id]", params: { id: fund.id } }}>
      <ScalePressable
        className="justify-center gap-2 px-4"
        opacityValue={0.7}
        scaleValue={0.98}
        style={{ height: CATEGORY_HEIGHT }}
      >
        <StyledLeanView className="flex-row items-center justify-between gap-3">
          <StyledLeanView className="shrink flex-row items-center gap-1.5">
            {isFunded && <Check color={savingsColor} size={16} />}
            <StyledLeanText
              className="shrink font-satoshi-medium text-base text-foreground"
              ellipsizeMode="tail"
              numberOfLines={1}
            >
              {fund.name}
            </StyledLeanText>
          </StyledLeanView>

          <QuickStatSpending fund={fund} />
        </StyledLeanView>

        <StyledLeanView className="flex-row gap-2">
          {overspentRatio > 0 && (
            <ProgressBar
              color={destructiveColor}
              flex={overspentRatio}
              progress={1}
            />
          )}
          {progressBars.map((progress, index) => {
            const isCurrentPeriod = index === barCount - 1;

            return (
              <ProgressBar
                color={savingsColor}
                highlight={barCount > 1 ? isCurrentPeriod : false}
                key={index}
                progress={progress}
              />
            );
          })}
        </StyledLeanView>
      </ScalePressable>
    </Link>
  );
}
