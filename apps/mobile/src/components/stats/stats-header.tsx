import { Text, View } from "react-native";
import SpendingPieChart, { type FundData } from "./pie-chart";

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

export default function StatsHeader({ data, isLoading }: Props) {
  // Loading state
  if (isLoading || !data) {
    return (
      <View className="flex-row gap-4">
        {/* Skeleton for pie chart (60%) */}
        <View className="flex-[3] items-center justify-center">
          <View className="h-[140] w-[140] rounded-full bg-muted" />
        </View>
        {/* Skeleton for stats panel (40%) */}
        <View className="flex-[2] justify-center gap-3">
          <View className="gap-1">
            <View className="h-3 w-20 rounded bg-muted" />
            <View className="h-7 w-24 rounded bg-muted" />
          </View>
          <View className="h-px w-full bg-border" />
          <View className="gap-2">
            <View className="h-3 w-16 rounded bg-muted" />
            <View className="h-4 w-full rounded bg-muted" />
            <View className="h-4 w-full rounded bg-muted" />
            <View className="h-4 w-full rounded bg-muted" />
          </View>
        </View>
      </View>
    );
  }

  const topFunds = getTopFunds(data.byFund, MAX_TOP_FUNDS);

  return (
    <View className="flex-row gap-4">
      {/* Pie chart - 60% */}
      <View className="flex-[3] items-center justify-center">
        <SpendingPieChart data={data.byFund} size={140} />
      </View>

      {/* Quick stats panel - 40% */}
      <View className="flex-[2] justify-center gap-3">
        {/* Total spent */}
        <View>
          <Text className="font-satoshi-medium text-muted-foreground text-xs">
            Total Spent
          </Text>
          <Text className="font-nunito-bold text-2xl text-foreground">
            {currencyFormatter.format(data.totalSpent)}
          </Text>
        </View>

        {/* Divider */}
        <View className="h-px w-full bg-border" />

        {/* Top funds */}
        <View className="gap-1">
          <Text className="font-satoshi-medium text-muted-foreground text-xs">
            Top Funds
          </Text>
          {topFunds.length === 0 ? (
            <Text className="font-satoshi-medium text-muted-foreground text-sm">
              No spending yet
            </Text>
          ) : (
            topFunds.map((fund, index) => (
              <View
                className="flex-row items-center justify-between"
                key={fund.fundId}
              >
                <Text
                  className="flex-1 font-satoshi-medium text-foreground text-sm"
                  ellipsizeMode="tail"
                  numberOfLines={1}
                >
                  {index + 1}. {fund.fundName}
                </Text>
                <Text className="font-nunito-bold text-foreground text-sm">
                  {currencyFormatter.format(fund.amount)}
                </Text>
              </View>
            ))
          )}
        </View>
      </View>
    </View>
  );
}
