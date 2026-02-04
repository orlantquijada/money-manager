import type { FundType } from "api";
import { useColorScheme } from "react-native";
import { IconSymbol } from "@/components/ui/icon-symbol.ios";
import { StyledLeanText, StyledLeanView } from "@/config/interop";
import { lime, limeDark, red, redDark } from "@/utils/colors";
import { toCurrencyNarrow } from "@/utils/format";

type TopStore = {
  storeId: number | null;
  storeName: string;
  amount: number;
};

type PeriodComparison = {
  current: number;
  previous: number;
  difference: number;
  percentageChange: number;
} | null;

type Props = {
  topStores: TopStore[];
  storeCount: number;
  periodComparison: PeriodComparison;
  fundType: FundType;
};

export default function FundInsights({
  topStores,
  storeCount,
  periodComparison,
  fundType,
}: Props) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const showTopStores = storeCount > 3 && topStores.length > 0;
  const showComparison = periodComparison !== null;

  if (!(showTopStores || showComparison)) {
    return null;
  }

  return (
    <StyledLeanView className="gap-3">
      <StyledLeanText className="font-satoshi-medium text-foreground-muted">
        Insights
      </StyledLeanText>

      {showTopStores && (
        <StyledLeanView
          className="rounded-2xl bg-card p-4"
          style={{ borderCurve: "continuous" }}
        >
          <StyledLeanText className="mb-3 font-satoshi-medium text-foreground-muted text-sm">
            Top Stores
          </StyledLeanText>
          <StyledLeanView className="gap-2">
            {topStores.map((store, index) => (
              <StyledLeanView
                className="flex-row items-center justify-between"
                key={store.storeId ?? `store-${index}`}
              >
                <StyledLeanText className="font-satoshi text-foreground">
                  {store.storeName}
                </StyledLeanText>
                <StyledLeanText className="font-nunito-semibold text-foreground-muted">
                  {toCurrencyNarrow(store.amount)}
                </StyledLeanText>
              </StyledLeanView>
            ))}
          </StyledLeanView>
        </StyledLeanView>
      )}

      {showComparison && (
        <PeriodComparisonCard
          comparison={periodComparison}
          fundType={fundType}
          isDark={isDark}
        />
      )}
    </StyledLeanView>
  );
}

type PeriodComparisonCardProps = {
  comparison: NonNullable<PeriodComparison>;
  fundType: FundType;
  isDark: boolean;
};

function PeriodComparisonCard({
  comparison,
  fundType,
  isDark,
}: PeriodComparisonCardProps) {
  const { percentageChange, difference } = comparison;
  const isIncrease = difference > 0;
  const absPercent = Math.abs(Math.round(percentageChange));

  // For SPENDING: increase is bad (red), decrease is good (green)
  // For NON_NEGOTIABLE: increase is good (green = more allocated), decrease is neutral
  const isPositiveChange =
    fundType === "NON_NEGOTIABLE" ? isIncrease : !isIncrease;

  const limeColors = isDark ? limeDark : lime;
  const redColors = isDark ? redDark : red;

  const textColor = isPositiveChange ? limeColors.lime11 : redColors.red11;
  const iconName = isIncrease ? "arrow.up" : "arrow.down";

  const label =
    fundType === "NON_NEGOTIABLE"
      ? `${absPercent}% ${isIncrease ? "more" : "less"} allocated`
      : `${absPercent}% ${isIncrease ? "more" : "less"} than last month`;

  return (
    <StyledLeanView
      className="flex-row items-center gap-2 rounded-2xl bg-card p-4"
      style={{ borderCurve: "continuous" }}
    >
      <IconSymbol
        color={textColor}
        name={iconName as "arrow.up" | "arrow.down"}
        size={16}
      />
      <StyledLeanText className="font-satoshi" style={{ color: textColor }}>
        {label}
      </StyledLeanText>
    </StyledLeanView>
  );
}
