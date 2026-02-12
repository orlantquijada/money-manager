import { useEffect } from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { StyledLeanText, StyledLeanView } from "@/config/interop";
import { useChartColor } from "@/lib/chart-colors";
import { wholeCurrencyFormatterOptions } from "@/utils/format";
import { transitions } from "@/utils/motion";
import { ScalePressable } from "../scale-pressable";
import type { FundData } from "./pie-chart-segmented";

const currencyFormatter = new Intl.NumberFormat(
  "en-PH",
  wholeCurrencyFormatterOptions
);

const SPRING_CONFIG = transitions.snappy;
// Match pie chart's FOCUS_OFFSET for visual consistency
const SELECTED_OFFSET = -8;
// Match pie chart's UNFOCUSED_OPACITY
const UNSELECTED_OPACITY = 0.3;

type TopFundsRowProps = {
  fund: FundData;
  index: number;
  onPress: (fundId: number) => void;
  isSelected: boolean;
  hasSelection: boolean;
};

export function TopFundsRow({
  fund,
  index,
  onPress,
  isSelected,
  hasSelection,
}: TopFundsRowProps) {
  const chartColor = useChartColor(index);
  // Use shared values for proper animation reactivity (matching pie chart pattern)
  const offset = useSharedValue(0);
  const opacity = useSharedValue(1);

  useEffect(() => {
    offset.set(withSpring(isSelected ? SELECTED_OFFSET : 0, SPRING_CONFIG));
    opacity.set(
      withSpring(
        hasSelection && !isSelected ? UNSELECTED_OPACITY : 1,
        SPRING_CONFIG
      )
    );
  }, [isSelected, hasSelection, offset.set, opacity.set, offset, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: offset.get() }],
    opacity: opacity.get(),
  }));

  return (
    <Animated.View style={animatedStyle}>
      <ScalePressable
        className="flex-row items-center justify-between gap-2"
        onPress={() => onPress(fund.fundId)}
      >
        <StyledLeanView
          className="h-2 w-2 shrink-0 rounded-full"
          style={{ backgroundColor: chartColor }}
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
      </ScalePressable>
    </Animated.View>
  );
}

type TopFundsProps = {
  funds: FundData[];
  onFundPress: (fundId: number) => void;
  selectedFundId?: number | null;
};

export default function TopFunds({
  funds,
  onFundPress,
  selectedFundId,
}: TopFundsProps) {
  const hasSelection = selectedFundId != null;

  return (
    <StyledLeanView className="gap-1">
      <StyledLeanText className="font-satoshi-medium text-muted-foreground text-xs">
        Top Funds
      </StyledLeanText>
      {funds.length ? (
        funds.map((fund, index) => (
          <TopFundsRow
            fund={fund}
            hasSelection={hasSelection}
            index={index}
            isSelected={fund.fundId === selectedFundId}
            key={fund.fundId}
            onPress={onFundPress}
          />
        ))
      ) : (
        <StyledLeanText className="font-satoshi-medium text-muted-foreground text-sm">
          No spending yet
        </StyledLeanText>
      )}
    </StyledLeanView>
  );
}
