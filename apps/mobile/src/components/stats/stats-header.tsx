import { StyledLeanText, StyledLeanView } from "@/config/interop";

import SpendingPieChart, { type FundData } from "./pie-chart";
import SpendingPieChartSegmented from "./pie-chart-segmented";

const MAX_TOP_FUNDS = 3;

type ChartVariant = "default" | "segmented";

type Props = {
  data:
    | {
        totalSpent: number;
        byFund: FundData[];
      }
    | undefined;
  isLoading?: boolean;
  chartVariant?: ChartVariant;
};

const currencyFormatter = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

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

export default function StatsHeader({
  data,
  isLoading,
  chartVariant = "segmented",
}: Props) {
  // Loading state
  if (isLoading || !data) {
    return (
      <StyledLeanView className="flex-row gap-4">
        {/* Skeleton for pie chart (60%) */}
        <StyledLeanView className="flex-3 items-center justify-center">
          <StyledLeanView className="h-[140] w-[140] rounded-full bg-muted" />
        </StyledLeanView>
        {/* Skeleton for stats panel (40%) */}
        <StyledLeanView className="flex-2 justify-center gap-3">
          <StyledLeanView className="gap-1">
            <StyledLeanView className="h-3 w-20 rounded bg-muted" />
            <StyledLeanView className="h-7 w-24 rounded bg-muted" />
          </StyledLeanView>
          <StyledLeanView className="h-px w-full bg-border" />
          <StyledLeanView className="gap-2">
            <StyledLeanView className="h-3 w-16 rounded bg-muted" />
            <StyledLeanView className="h-4 w-full rounded bg-muted" />
            <StyledLeanView className="h-4 w-full rounded bg-muted" />
            <StyledLeanView className="h-4 w-full rounded bg-muted" />
          </StyledLeanView>
        </StyledLeanView>
      </StyledLeanView>
    );
  }

  const topFunds = getTopFunds(data.byFund, MAX_TOP_FUNDS);

  const PieChart =
    chartVariant === "segmented" ? SpendingPieChartSegmented : SpendingPieChart;

  return (
    <StyledLeanView className="flex-row gap-4">
      {/* Pie chart - 60% */}
      <StyledLeanView className="flex-3 items-center justify-center">
        <PieChart data={data.byFund} size={140} />
      </StyledLeanView>

      {/* Quick stats panel - 40% */}
      <StyledLeanView className="flex-2 justify-center gap-3">
        {/* Total spent */}
        <StyledLeanView>
          <StyledLeanText className="font-satoshi-medium text-muted-foreground text-xs">
            Total Spent
          </StyledLeanText>
          <StyledLeanText className="font-nunito-bold text-2xl text-foreground">
            {currencyFormatter.format(data.totalSpent)}
          </StyledLeanText>
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
                className="flex-row items-center justify-between"
                key={fund.fundId}
              >
                <StyledLeanText
                  className="flex-1 font-satoshi-medium text-foreground text-sm"
                  ellipsizeMode="tail"
                  numberOfLines={1}
                >
                  {index + 1}. {fund.fundName}
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
