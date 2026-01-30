import Skeleton from "@/components/skeleton";
import { StyledLeanText, StyledLeanView } from "@/config/interop";
import { StyledIconSymbol } from "@/config/interop-icon-symbol";
import { cn } from "@/utils/cn";
import { toWholeCurrency } from "@/utils/format";
import InsightCard from "./insight-card";

type MonthComparison = {
  current: number;
  previous: number;
  percentageChange: number;
  isFirstMonth: boolean;
};

type Props = {
  comparison: MonthComparison | undefined;
  isLoading: boolean;
};

export default function MonthComparisonCard({ comparison, isLoading }: Props) {
  if (isLoading) {
    return (
      <InsightCard>
        <StyledLeanView className="gap-2">
          <Skeleton height={16} width={140} />
          <StyledLeanView className="flex-row items-center gap-2">
            <Skeleton height={24} width={100} />
            <Skeleton height={20} width={60} />
          </StyledLeanView>
        </StyledLeanView>
      </InsightCard>
    );
  }

  // Don't show for first month
  if (!comparison || comparison.isFirstMonth || comparison.previous === 0) {
    return null;
  }

  const isSpendingMore = comparison.percentageChange > 0;
  const absChange = Math.abs(Math.round(comparison.percentageChange));
  const iconName = isSpendingMore ? "arrow.up.right" : "arrow.down.right";
  const changeLabel = isSpendingMore ? "more" : "less";

  return (
    <InsightCard>
      <StyledLeanView className="gap-2">
        <StyledLeanText className="font-satoshi-medium text-foreground text-sm">
          vs Last Month
        </StyledLeanText>
        <StyledLeanView className="flex-row items-center gap-3">
          <StyledLeanText className="font-nunito-bold text-foreground text-xl">
            {toWholeCurrency(comparison.current)}
          </StyledLeanText>
          <StyledLeanView
            className={cn(
              "flex-row items-center gap-1 rounded-full bg-lime-9/20 px-2 py-1",
              isSpendingMore && "bg-red-9/20"
            )}
          >
            <StyledIconSymbol
              colorClassName={cn(
                "accent-lime-9",
                isSpendingMore && "accent-red-9"
              )}
              name={iconName}
              size={12}
              weight="bold"
            />
            <StyledLeanText
              className={cn(
                "font-satoshi-bold text-lime-9 text-xs",
                isSpendingMore && "text-red-9"
              )}
            >
              {absChange}% {changeLabel}
            </StyledLeanText>
          </StyledLeanView>
        </StyledLeanView>
        <StyledLeanText className="font-satoshi text-foreground-muted text-xs">
          Last month: {toWholeCurrency(comparison.previous)}
        </StyledLeanText>
      </StyledLeanView>
    </InsightCard>
  );
}
