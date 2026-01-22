import Skeleton from "@/components/skeleton";
import { useThemeColor } from "@/components/theme-provider";
import { StyledLeanText, StyledLeanView } from "@/config/interop";
import { toWholeCurrency } from "@/utils/format";
import InsightCard from "./insight-card";

type FundHighlight = {
  fundId: number;
  fundName: string;
  amount: number;
  budgeted: number;
  percentage: number;
};

type Props = {
  topOverspent: FundHighlight | null | undefined;
  topLeftover: FundHighlight | null | undefined;
  isLoading: boolean;
};

type MiniCardProps = {
  label: string;
  fundName: string;
  amount: number;
  color: string;
  prefix?: string;
};

function MiniCard({
  label,
  fundName,
  amount,
  color,
  prefix = "",
}: MiniCardProps) {
  return (
    <StyledLeanView className="flex-1 gap-1">
      <StyledLeanText className="font-satoshi text-foreground-muted text-xs">
        {label}
      </StyledLeanText>
      <StyledLeanText
        className="font-satoshi-medium text-foreground text-sm"
        ellipsizeMode="tail"
        numberOfLines={1}
      >
        {fundName}
      </StyledLeanText>
      <StyledLeanText className="font-nunito-bold text-base" style={{ color }}>
        {prefix}
        {toWholeCurrency(amount)}
      </StyledLeanText>
    </StyledLeanView>
  );
}

export default function KeyHighlightCard({
  topOverspent,
  topLeftover,
  isLoading,
}: Props) {
  const redColor = useThemeColor("red-9");
  const limeColor = useThemeColor("lime-9");

  if (isLoading) {
    return (
      <InsightCard>
        <StyledLeanView className="flex-row gap-4">
          <StyledLeanView className="flex-1 gap-2">
            <Skeleton height={12} width={80} />
            <Skeleton height={16} width="90%" />
            <Skeleton height={20} width={70} />
          </StyledLeanView>
          <StyledLeanView className="w-px bg-border" />
          <StyledLeanView className="flex-1 gap-2">
            <Skeleton height={12} width={80} />
            <Skeleton height={16} width="90%" />
            <Skeleton height={20} width={70} />
          </StyledLeanView>
        </StyledLeanView>
      </InsightCard>
    );
  }

  // Don't show if neither exists
  if (!(topOverspent || topLeftover)) {
    return null;
  }

  return (
    <InsightCard>
      <StyledLeanView className="flex-row gap-4">
        {topOverspent ? (
          <MiniCard
            amount={topOverspent.amount}
            color={redColor}
            fundName={topOverspent.fundName}
            label="Most overspent"
            prefix="+"
          />
        ) : (
          <StyledLeanView className="flex-1">
            <StyledLeanText className="font-satoshi text-foreground-muted text-xs">
              Most overspent
            </StyledLeanText>
            <StyledLeanText className="mt-1 font-satoshi text-foreground-muted text-sm">
              None this month
            </StyledLeanText>
          </StyledLeanView>
        )}

        <StyledLeanView className="w-px bg-border" />

        {topLeftover ? (
          <MiniCard
            amount={topLeftover.amount}
            color={limeColor}
            fundName={topLeftover.fundName}
            label="Most remaining"
          />
        ) : (
          <StyledLeanView className="flex-1">
            <StyledLeanText className="font-satoshi text-foreground-muted text-xs">
              Most remaining
            </StyledLeanText>
            <StyledLeanText className="mt-1 font-satoshi text-foreground-muted text-sm">
              None this month
            </StyledLeanText>
          </StyledLeanView>
        )}
      </StyledLeanView>
    </InsightCard>
  );
}
