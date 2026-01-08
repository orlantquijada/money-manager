import { Text, View } from "react-native";
import { Pie, PolarChart } from "victory-native";
import { CHART_COLORS, getChartColor } from "@/lib/chart-colors";

const MAX_SLICES = 5;

export type FundData = {
  fundId: number;
  fundName: string;
  amount: number;
  percentage: number;
};

type PieSlice = {
  label: string;
  value: number;
  color: string;
  amount: number;
};

type Props = {
  data: FundData[];
  size?: number;
};

/**
 * Prepares data for pie chart display.
 * Shows top 5 funds individually, groups remainder into "Other".
 */
function preparePieData(data: FundData[]): PieSlice[] {
  if (data.length === 0) return [];

  // Sort by amount descending (should already be sorted from API)
  const sorted = [...data].sort((a, b) => b.amount - a.amount);

  if (sorted.length <= MAX_SLICES) {
    return sorted.map((fund, index) => ({
      label: fund.fundName,
      value: fund.percentage,
      color: getChartColor(index),
      amount: fund.amount,
    }));
  }

  // Take top 5, group rest into "Other"
  const top5 = sorted.slice(0, MAX_SLICES);
  const others = sorted.slice(MAX_SLICES);

  const otherAmount = others.reduce((sum, f) => sum + f.amount, 0);
  const otherPercentage = others.reduce((sum, f) => sum + f.percentage, 0);

  const slices: PieSlice[] = top5.map((fund, index) => ({
    label: fund.fundName,
    value: fund.percentage,
    color: getChartColor(index),
    amount: fund.amount,
  }));

  slices.push({
    label: "Other",
    value: otherPercentage,
    color: CHART_COLORS[5], // Lightest shade for "Other"
    amount: otherAmount,
  });

  return slices;
}

const currencyFormatter = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export default function SpendingPieChart({ data, size = 150 }: Props) {
  const pieData = preparePieData(data);

  // Empty state - show placeholder circle
  if (pieData.length === 0) {
    return (
      <View
        className="items-center justify-center"
        style={{ width: size, height: size }}
      >
        <View
          className="rounded-full bg-muted"
          style={{ width: size * 0.8, height: size * 0.8 }}
        />
      </View>
    );
  }

  // Show top fund info in center
  const topFund = pieData[0];

  return (
    <View style={{ width: size, height: size }}>
      <PolarChart
        colorKey="color"
        data={pieData}
        labelKey="label"
        valueKey="value"
      >
        <Pie.Chart innerRadius="50%">{() => <Pie.Slice />}</Pie.Chart>
      </PolarChart>

      {/* Center label showing top fund */}
      {topFund && (
        <View
          className="absolute items-center justify-center"
          pointerEvents="none"
          style={{
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        >
          <Text
            className="max-w-[80%] text-center font-satoshi-medium text-foreground text-xs"
            ellipsizeMode="tail"
            numberOfLines={1}
          >
            {topFund.label}
          </Text>
          <Text className="font-nunito-bold text-foreground text-sm">
            {currencyFormatter.format(topFund.amount)}
          </Text>
        </View>
      )}
    </View>
  );
}
