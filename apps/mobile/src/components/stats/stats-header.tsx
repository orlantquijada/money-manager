import { useCallback, useEffect, useState } from "react";
import {
  useDerivedValue,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { AnimatedText } from "@/components/animated-text";
import { StyledLeanText, StyledLeanView } from "@/config/interop";
import { wholeCurrencyFormatterOptions } from "@/utils/format";
import { transitions } from "@/utils/motion";
import type { Period } from "./period-chips";
import SpendingPieChartSegmented, {
  type FundData,
  type SliceId,
} from "./pie-chart-segmented";
import StatsHeaderSkeleton from "./stats-header-skeleton";
import TopFunds from "./top-funds";

const SPRING_CONFIG = transitions.snappy;
const MAX_TOP_FUNDS = 3;

const PREVIOUS_PERIOD_LABELS: Record<Period, string> = {
  week: "last week",
  month: "last month",
  "3mo": "previous 3 months",
  all: "",
};

type Props = {
  data:
    | {
        totalSpent: number;
        byFund: FundData[];
        comparison?: {
          previousTotal: number;
          difference: number;
          percentageChange: number;
        };
      }
    | undefined;
  period: Period;
  isLoading?: boolean;
};

/**
 * Gets top N funds, using alphabetical order as tiebreaker for equal amounts.
 */
function getTopFunds(funds: FundData[], count: number): FundData[] {
  return [...funds]
    .sort((a, b) => {
      // Primary: amount descending
      if (b.amount !== a.amount) return b.amount - a.amount;
      // Tiebreaker: alphabetical by fund name
      return a.fundName.localeCompare(b.fundName);
    })
    .slice(0, count);
}

export default function StatsHeader({ data, period, isLoading }: Props) {
  // Animation for total spent value
  const animatedTotalSpent = useSharedValue(0);

  useEffect(() => {
    animatedTotalSpent.set(withSpring(data?.totalSpent ?? 0, SPRING_CONFIG));
  }, [data?.totalSpent, animatedTotalSpent.set]);

  const animatedTotalSpentText = useDerivedValue(() => {
    const _currencyFormatter = new Intl.NumberFormat(
      "en-PH",
      wholeCurrencyFormatterOptions
    );

    return _currencyFormatter.format(Math.round(animatedTotalSpent.get()));
  });

  const topFunds = getTopFunds(data?.byFund ?? [], MAX_TOP_FUNDS);
  const [selectedFundId, setSelectedFundId] = useState<SliceId | undefined>(
    undefined
  );

  const handleTopFundPress = useCallback((fundId: number) => {
    // Toggle: if already selected, deselect (undefined means nothing selected)
    setSelectedFundId((prev) => (prev === fundId ? undefined : fundId));
  }, []);

  // Loading state
  if (isLoading || !data) {
    return <StatsHeaderSkeleton />;
  }

  return (
    <StyledLeanView className="flex-row gap-4">
      <SpendingPieChartSegmented
        data={data.byFund}
        onSelectFundId={setSelectedFundId}
        selectedFundId={selectedFundId}
        size={180}
      />

      <StyledLeanView className="grow justify-center gap-3">
        {/* Total spent */}
        <StyledLeanView>
          <StyledLeanText className="font-satoshi-medium text-muted-foreground text-xs">
            Total Spent
          </StyledLeanText>
          <AnimatedText
            className="font-nunito-bold text-2xl text-foreground"
            text={animatedTotalSpentText}
          />
          <ComparisonText comparison={data.comparison} period={period} />
        </StyledLeanView>

        {/* Divider */}
        <StyledLeanView className="h-hairline w-full bg-border" />

        {/* Top funds */}
        <TopFunds
          funds={topFunds}
          onFundPress={handleTopFundPress}
          selectedFundId={selectedFundId}
        />
      </StyledLeanView>
    </StyledLeanView>
  );
}

type ComparisonTextProps = {
  comparison: Props["data"] extends { comparison: infer C } ? C : never;
  period: Period;
};

function ComparisonText({ comparison, period }: ComparisonTextProps) {
  if (!comparison || period === "all") return null;

  const currencyFormatter = new Intl.NumberFormat(
    "en-PH",
    wholeCurrencyFormatterOptions
  );

  const { difference, percentageChange } = comparison;
  const absDifference = Math.abs(difference);
  const periodLabel = PREVIOUS_PERIOD_LABELS[period];

  // Within ±5% is considered "similar"
  if (Math.abs(percentageChange) <= 5) {
    return (
      <StyledLeanText className="mt-0.5 font-satoshi-medium text-foreground-muted text-xs">
        Similar to {periodLabel}
      </StyledLeanText>
    );
  }

  const isMore = difference > 0;
  const arrow = isMore ? "↑" : "↓";
  const colorClass = isMore ? "text-red-9" : "text-grass-9";

  return (
    <StyledLeanText
      className={`mt-0.5 font-satoshi-medium text-xs ${colorClass}`}
    >
      {arrow} {currencyFormatter.format(absDifference)} vs {periodLabel}
    </StyledLeanText>
  );
}
