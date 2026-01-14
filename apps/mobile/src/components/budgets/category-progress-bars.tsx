import { StyledLeanView } from "@/config/interop";
import type { FundWithMeta } from "@/lib/fund";
import { getTimeModeMultiplier } from "@/lib/fund";
import { getCurrentPeriodIndex, useFundProgress } from "./category-utils";
import ProgressBar from "./progress-bar";

type Props = {
  fund: FundWithMeta;
};

export default function CategoryProgressBars({ fund }: Props) {
  const barCount = getTimeModeMultiplier(fund.timeMode);
  const { progressBars, overspentRatio } = useFundProgress(fund);
  const isNonNegotiable = fund.fundType === "NON_NEGOTIABLE";

  const colorVariant = isNonNegotiable ? "non-negotiable" : "spending";

  return (
    <StyledLeanView className="flex-row gap-2">
      {overspentRatio > 0 && (
        <ProgressBar
          colorVariant="destructive"
          flex={overspentRatio}
          progress={1}
        />
      )}
      {progressBars.map((progress, index) => (
        <ProgressBar
          colorVariant={colorVariant}
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
