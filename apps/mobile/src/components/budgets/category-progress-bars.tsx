import { StyledLeanView } from "@/config/interop";
import type { FundWithMeta } from "@/lib/fund";
import { getTimeModeMultiplier } from "@/lib/fund";
import { fadeInOutSpringify, layoutSpringify } from "@/utils/motion";
import {
  getCurrentPeriodIndex,
  useFundProgress,
  useRollingProgress,
} from "./category-utils";
import ProgressBar from "./progress-bar";

type Props = {
  fund: FundWithMeta;
  /** "dashboard" = single rolling bar, "detail" = multi-segment bars */
  variant?: "dashboard" | "detail";
};

/**
 * Progress bar display for funds.
 * - Dashboard: Single consolidated bar with rolling budget calculation
 * - Detail: Multi-segment bars showing per-period breakdown
 */
export default function CategoryProgressBars({
  fund,
  variant = "dashboard",
}: Props) {
  if (variant === "detail") {
    return <MultiSegmentBars fund={fund} />;
  }

  return <SingleRollingBar fund={fund} />;
}

/** Dashboard view: Single bar with rolling budget */
function SingleRollingBar({ fund }: { fund: FundWithMeta }) {
  const { progress, overspentRatio } = useRollingProgress(fund);
  const isNonNegotiable = fund.fundType === "NON_NEGOTIABLE";
  const colorVariant = isNonNegotiable ? "non-negotiable" : "spending";

  return (
    <StyledLeanView className="flex-row gap-1">
      {overspentRatio > 0 && (
        <ProgressBar
          colorVariant="destructive"
          entering={fadeInOutSpringify("soft").entering}
          flex={overspentRatio}
          layout={layoutSpringify("soft")}
          progress={1}
        />
      )}
      <ProgressBar
        colorVariant={colorVariant}
        layout={layoutSpringify("soft")}
        progress={progress}
      />
    </StyledLeanView>
  );
}

/** Detail view: Multi-segment bars per period */
function MultiSegmentBars({ fund }: { fund: FundWithMeta }) {
  const barCount = getTimeModeMultiplier(fund.timeMode);
  const { progressBars, overspentRatio } = useFundProgress(fund);
  const isNonNegotiable = fund.fundType === "NON_NEGOTIABLE";
  const colorVariant = isNonNegotiable ? "non-negotiable" : "spending";

  return (
    <StyledLeanView className="flex-row gap-2">
      {overspentRatio > 0 && (
        <ProgressBar
          colorVariant="destructive"
          entering={fadeInOutSpringify("soft").entering}
          flex={overspentRatio}
          layout={layoutSpringify("soft")}
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
          layout={layoutSpringify("soft")}
          progress={progress}
        />
      ))}
    </StyledLeanView>
  );
}
