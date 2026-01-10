import { useEffect } from "react";
import {
  useDerivedValue,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { AnimatedText } from "@/components/animated-text";
import { StyledLeanText, StyledLeanView } from "@/config/interop";
import { getChartColor } from "@/lib/chart-colors";
import { transitions } from "@/utils/motion";

import SpendingPieChartSegmented, {
  type FundData,
} from "./pie-chart-segmented";
import StatsHeaderSkeleton from "./stats-header-skeleton";

const SPRING_CONFIG = transitions.snappy;
const MAX_TOP_FUNDS = 3;

type Props = {
  data:
    | {
        totalSpent: number;
        byFund: FundData[];
      }
    | undefined;
  isLoading?: boolean;
};

const currencyFormatterOptions = {
  style: "currency",
  currency: "PHP",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
} as const;

const currencyFormatter = new Intl.NumberFormat(
  "en-PH",
  currencyFormatterOptions
);

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

export default function StatsHeader({ data, isLoading }: Props) {
  // Animation for total spent value
  const animatedTotalSpent = useSharedValue(0);

  useEffect(() => {
    animatedTotalSpent.set(withSpring(data?.totalSpent ?? 0, SPRING_CONFIG));
  }, [data?.totalSpent, animatedTotalSpent.set]);

  const animatedTotalSpentText = useDerivedValue(() => {
    const _currencyFormatter = new Intl.NumberFormat(
      "en-PH",
      currencyFormatterOptions
    );

    return _currencyFormatter.format(Math.round(animatedTotalSpent.get()));
  });

  // Loading state
  if (isLoading || !data) {
    return <StatsHeaderSkeleton />;
  }

  const topFunds = getTopFunds(data.byFund, MAX_TOP_FUNDS);

  return (
    <StyledLeanView className="flex-row gap-4">
      <SpendingPieChartSegmented data={data.byFund} size={180} />

      <StyledLeanView className="grow justify-center gap-3 pr-2">
        {/* Total spent */}
        <StyledLeanView>
          <StyledLeanText className="font-satoshi-medium text-muted-foreground text-xs">
            Total Spent
          </StyledLeanText>
          <AnimatedText
            className="font-nunito-bold text-2xl text-foreground"
            text={animatedTotalSpentText}
          />
        </StyledLeanView>

        {/* Divider */}
        <StyledLeanView className="h-px w-full bg-border" />

        {/* Top funds */}
        <StyledLeanView className="gap-1">
          <StyledLeanText className="font-satoshi-medium text-muted-foreground text-xs">
            Top Funds
          </StyledLeanText>
          {topFunds.length === 0 ? (
            <StyledLeanText className="font-satoshi-medium text-muted-foreground text-sm">
              No spending yet
            </StyledLeanText>
          ) : (
            topFunds.map((fund, index) => (
              <StyledLeanView
                className="flex-row items-center justify-between gap-2"
                key={fund.fundId}
              >
                <StyledLeanView
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{ backgroundColor: getChartColor(index) }}
                />
                <StyledLeanText
                  className="flex-1 font-satoshi-medium text-foreground text-sm"
                  ellipsizeMode="tail"
                  numberOfLines={1}
                >
                  {fund.fundName}
                </StyledLeanText>
                <StyledLeanText className="font-nunito-bold text-foreground text-sm">
                  {currencyFormatter.format(fund.amount)}
                </StyledLeanText>
              </StyledLeanView>
            ))
          )}
        </StyledLeanView>
      </StyledLeanView>
    </StyledLeanView>
  );
}
