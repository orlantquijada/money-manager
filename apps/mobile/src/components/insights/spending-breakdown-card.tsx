import { useCallback, useState } from "react";
import Skeleton from "@/components/skeleton";
import SpendingPieChartSegmented, {
  type FundData,
  type SliceId,
} from "@/components/stats/pie-chart-segmented";
import { StyledLeanText, StyledLeanView } from "@/config/interop";
import { useChartColors } from "@/lib/chart-colors";
import InsightCard from "./insight-card";

type SpendingCategory = {
  fundId: number;
  fundName: string;
  amount: number;
  percentage: number;
};

type Props = {
  breakdown: SpendingCategory[] | undefined;
  totalSpending: number | undefined;
  isLoading: boolean;
};

function LegendItem({
  color,
  name,
  percentage,
}: {
  color: string;
  name: string;
  percentage: number;
}) {
  return (
    <StyledLeanView className="flex-row items-center gap-2">
      <StyledLeanView
        className="size-2.5 rounded-full"
        style={{ backgroundColor: color }}
      />
      <StyledLeanText
        className="flex-1 font-satoshi text-foreground text-xs"
        ellipsizeMode="tail"
        numberOfLines={1}
      >
        {name}
      </StyledLeanText>
      <StyledLeanText className="font-satoshi text-foreground-muted text-xs">
        {Math.round(percentage)}%
      </StyledLeanText>
    </StyledLeanView>
  );
}

export default function SpendingBreakdownCard({
  breakdown,
  totalSpending,
  isLoading,
}: Props) {
  const chartColors = useChartColors();
  const [selectedFundId, setSelectedFundId] = useState<SliceId | undefined>(
    undefined
  );

  const handleSelectFundId = useCallback((fundId: SliceId | undefined) => {
    setSelectedFundId(fundId);
  }, []);

  if (isLoading) {
    return (
      <InsightCard>
        <StyledLeanView className="gap-3">
          <Skeleton height={16} width={140} />
          <StyledLeanView className="flex-row items-center gap-4">
            <Skeleton height={120} width={120} />
            <StyledLeanView className="flex-1 gap-2">
              <Skeleton height={14} width="100%" />
              <Skeleton height={14} width="90%" />
              <Skeleton height={14} width="80%" />
              <Skeleton height={14} width="70%" />
            </StyledLeanView>
          </StyledLeanView>
        </StyledLeanView>
      </InsightCard>
    );
  }

  if (!breakdown || breakdown.length === 0 || !totalSpending) {
    return null;
  }

  // Convert to FundData format for pie chart
  const pieData: FundData[] = breakdown.map((cat) => ({
    fundId: cat.fundId,
    fundName: cat.fundName,
    amount: cat.amount,
    percentage: cat.percentage,
  }));

  return (
    <InsightCard>
      <StyledLeanView className="gap-3">
        <StyledLeanText className="font-satoshi-medium text-foreground text-sm">
          Spending Breakdown
        </StyledLeanText>
        <StyledLeanView className="flex-row items-center gap-4">
          <SpendingPieChartSegmented
            data={pieData}
            onSelectFundId={handleSelectFundId}
            selectedFundId={selectedFundId}
            size={120}
          />
          <StyledLeanView className="flex-1 gap-2">
            {breakdown.slice(0, 5).map((cat, index) => (
              <LegendItem
                color={chartColors[index % chartColors.length]}
                key={cat.fundId}
                name={cat.fundName}
                percentage={cat.percentage}
              />
            ))}
          </StyledLeanView>
        </StyledLeanView>
      </StyledLeanView>
    </InsightCard>
  );
}
