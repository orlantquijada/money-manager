import { useThemeColor } from "@/components/theme-provider";
import { StyledLeanView } from "@/config/interop";
import type { FundWithMeta } from "@/lib/fund";
import { getTimeModeMultiplier } from "@/lib/fund";
import {
  getCurrentPeriodIndex,
  getSavingsColor,
  useFundProgress,
} from "./category-utils";
import ProgressBar from "./progress-bar";

type Props = {
  fund: FundWithMeta;
};

export default function CategoryProgressBars({ fund }: Props) {
  const destructiveColor = useThemeColor("destructive");

  const barCount = getTimeModeMultiplier(fund.timeMode);
  const { progressBars, overspentRatio } = useFundProgress(fund);
  const isNonNegotiable = fund.fundType === "NON_NEGOTIABLE";

  // For NON_NEGOTIABLE, use savings color based on overall progress
  const overallProgress = fund.totalSpent / (fund.budgetedAmount * barCount);
  const savingsColorKey = isNonNegotiable
    ? getSavingsColor(overallProgress)
    : "violet-6";
  const savingsColor = useThemeColor(savingsColorKey);

  return (
    <StyledLeanView className="flex-row gap-2">
      {overspentRatio > 0 && (
        <ProgressBar
          color={destructiveColor}
          flex={overspentRatio}
          progress={1}
        />
      )}
      {progressBars.map((progress, index) => (
        <ProgressBar
          color={savingsColor}
          highlight={
            barCount > 1 && index === getCurrentPeriodIndex(fund.timeMode)
          }
          key={index}
          progress={progress}
        />
      ))}
    </StyledLeanView>
  );
}
