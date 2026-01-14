import { arc, type PieArcDatum, pie } from "d3-shape";
import * as Haptics from "expo-haptics";
import { useCallback, useEffect, useMemo } from "react";
import { Pressable } from "react-native";
import Animated, {
  useAnimatedProps,
  useDerivedValue,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { G, Path, Svg } from "react-native-svg";
import { AnimatedText } from "@/components/animated-text";
import { StyledLeanText, StyledLeanView } from "@/config/interop";
import { useChartColors } from "@/lib/chart-colors";
import { wholeCurrencyFormatterOptions } from "@/utils/format";
import { sum } from "@/utils/math";
import { fadeInOutSpringify, transitions } from "@/utils/motion";

const MAX_SLICES = 5;

const FOCUS_OFFSET = 8; // radial pop-out distance in px
const UNFOCUSED_OPACITY = 0.3;

// Chart geometry constants
const PAD_ANGLE = 0.05; // ~2-3px gaps between slices
const CORNER_RADIUS = 6; // pill-shaped rounded corners
const INNER_RADIUS_RATIO = 0.7; // 50% inner radius (donut)

export type FundData = {
  fundId: number;
  fundName: string;
  amount: number;
  percentage: number;
  budgetedAmount?: number;
  budgetUtilization?: number;
};

/** Represents a slice identifier: number for specific fundId, null for "Other" aggregated slice */
export type SliceId = number | null;

type PieSlice = {
  fundId: SliceId;
  label: string;
  value: number;
  color: string;
  amount: number;
  budgetedAmount?: number;
};

type Props = {
  data: FundData[];
  size?: number;
  /** undefined = nothing selected, null = "Other" selected, number = specific fund */
  selectedFundId: SliceId | undefined;
  /** Callback when selection changes */
  onSelectFundId: (fundId: SliceId | undefined) => void;
};

/**
 * Prepares data for pie chart display.
 * Shows top 5 funds individually, groups remainder into "Other".
 */
function preparePieData(data: FundData[], chartColors: string[]): PieSlice[] {
  if (data.length === 0) return [];

  // Sort by amount descending (should already be sorted from API)
  const sorted = [...data].sort((a, b) => b.amount - a.amount);

  if (sorted.length <= MAX_SLICES) {
    return sorted.map((fund, index) => ({
      fundId: fund.fundId,
      label: fund.fundName,
      value: fund.percentage,
      color: chartColors[index % chartColors.length],
      amount: fund.amount,
      budgetedAmount: fund.budgetedAmount,
    }));
  }

  // Take top 5, group rest into "Other"
  const top5 = sorted.slice(0, MAX_SLICES);
  const others = sorted.slice(MAX_SLICES);

  const otherAmount = sum(others.map(({ amount }) => amount));
  const otherPercentage = sum(others.map(({ percentage }) => percentage));

  const slices: PieSlice[] = top5.map((fund, index) => ({
    fundId: fund.fundId,
    label: fund.fundName,
    value: fund.percentage,
    color: chartColors[index % chartColors.length],
    amount: fund.amount,
    budgetedAmount: fund.budgetedAmount,
  }));

  slices.push({
    fundId: null, // "Other" has no specific fundId
    label: "Other",
    value: otherPercentage,
    color: chartColors[5], // Lightest shade for "Other"
    amount: otherAmount,
    // "Other" has no budget
  });

  return slices;
}

// Create animated components
const AnimatedPath = Animated.createAnimatedComponent(Path);

type AnimatedSliceProps = {
  arcDatum: PieArcDatum<PieSlice>;
  pathData: string;
  color: string;
  fundId: SliceId;
  selectedFundId: SliceId | undefined;
  onPress: (fundId: SliceId) => void;
};

function AnimatedSlice({
  arcDatum,
  pathData,
  color,
  fundId,
  selectedFundId,
  onPress,
}: AnimatedSliceProps) {
  // Calculate middle angle for radial offset direction
  // Subtract PI/2 to convert from d3's coordinate system (0 = 12 o'clock)
  const midAngle = useMemo(
    () => (arcDatum.startAngle + arcDatum.endAngle) / 2 - Math.PI / 2,
    [arcDatum.startAngle, arcDatum.endAngle]
  );

  // Animation shared values
  const offset = useSharedValue(0);
  const opacity = useSharedValue(1);

  // A slice is focused only if explicitly selected
  // fundId=null means "Other" slice, selectedFundId=undefined means nothing selected
  const isFocused = selectedFundId !== undefined && selectedFundId === fundId;
  const anySelected = selectedFundId !== undefined;

  useEffect(() => {
    offset.set(withSpring(isFocused ? FOCUS_OFFSET : 0, transitions.snappy));
    opacity.set(
      withSpring(
        anySelected && !isFocused ? UNFOCUSED_OPACITY : 1,
        transitions.snappy
      )
    );
  }, [anySelected, isFocused, opacity.set, offset.set]);

  // Compute translation for radial pop-out
  const translateX = Math.cos(midAngle);
  const translateY = Math.sin(midAngle);

  // Animated props for main slice
  const animatedSliceProps = useAnimatedProps(() => ({
    opacity: opacity.get(),
    transform: [
      { translateX: translateX * offset.get() },
      { translateY: translateY * offset.get() },
    ],
  }));

  return (
    <G>
      <AnimatedPath
        animatedProps={animatedSliceProps}
        d={pathData}
        fill={color}
        onPressIn={() => onPress(fundId)}
      />
    </G>
  );
}

type CenterLabelProps = {
  displaySlice: PieSlice | undefined;
  selectedFundId: SliceId | undefined;
};

const currencyFormatter = new Intl.NumberFormat(
  "en-PH",
  wholeCurrencyFormatterOptions
);

function CenterLabel({ displaySlice, selectedFundId }: CenterLabelProps) {
  const animatedValue = useSharedValue(displaySlice?.value ?? 0);

  useEffect(() => {
    animatedValue.set(withSpring(displaySlice?.value ?? 0, transitions.snappy));
  }, [displaySlice?.value, animatedValue.set]);

  const animatedText = useDerivedValue(() => {
    return `${Math.round(animatedValue.get())}%`;
  });

  if (!displaySlice) return null;

  // Budget context line: only shown when a slice is selected
  const isSelected = selectedFundId !== undefined;
  const budgetLine = (() => {
    if (!isSelected) return null;
    const { amount, budgetedAmount } = displaySlice;
    if (budgetedAmount) {
      // Budgeted fund: "₱12,000 / ₱15,000"
      return `${currencyFormatter.format(amount)} / ${currencyFormatter.format(budgetedAmount)}`;
    }
    // Non-budgeted fund: "₱2,500 spent"
    return `${currencyFormatter.format(amount)} spent`;
  })();

  return (
    <Animated.View
      className="absolute items-center justify-center"
      pointerEvents="none"
      style={{ top: 0, left: 0, right: 0, bottom: 0 }}
    >
      <AnimatedText
        className="font-nunito-bold text-2xl text-foreground"
        text={animatedText}
      />
      <Animated.Text
        className="max-w-[80%] text-center font-satoshi-medium text-foreground text-xs"
        ellipsizeMode="tail"
        {...fadeInOutSpringify("snappy")}
        key={selectedFundId}
        numberOfLines={1}
      >
        {displaySlice.label}
      </Animated.Text>
      {budgetLine && (
        <StyledLeanText
          className="mt-0.5 max-w-[90%] text-center font-satoshi-medium text-foreground-muted text-xs"
          ellipsizeMode="tail"
          numberOfLines={1}
        >
          {budgetLine}
        </StyledLeanText>
      )}
    </Animated.View>
  );
}

export default function SpendingPieChartSegmented({
  data,
  size = 150,
  selectedFundId,
  onSelectFundId,
}: Props) {
  const chartColors = useChartColors();
  const pieData = useMemo(
    () => preparePieData(data, chartColors),
    [data, chartColors]
  );

  const handleSlicePress = useCallback(
    (fundId: SliceId) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      // Toggle selection - tapping same slice deselects it (sets to undefined)
      onSelectFundId(selectedFundId === fundId ? undefined : fundId);
    },
    [selectedFundId, onSelectFundId]
  );

  // Empty state - show placeholder circle
  if (pieData.length === 0) {
    return (
      <StyledLeanView
        className="items-center justify-center"
        style={{ width: size, height: size }}
      >
        <StyledLeanView
          className="rounded-full bg-muted"
          style={{ width: size * 0.8, height: size * 0.8 }}
        />
      </StyledLeanView>
    );
  }

  // Calculate chart geometry (reserve space for focus offset animation)
  const outerRadius = size / 2 - FOCUS_OFFSET;
  const innerRadius = outerRadius * INNER_RADIUS_RATIO;
  const center = size / 2;

  // Create d3 generators
  const pieGenerator = pie<PieSlice>()
    .value((d) => d.value)
    .padAngle(PAD_ANGLE)
    .sort(null); // Preserve data order (no sorting)

  const arcGenerator = arc<PieArcDatum<PieSlice>>()
    .innerRadius(innerRadius)
    .outerRadius(outerRadius)
    .cornerRadius(CORNER_RADIUS);

  // Compute arc data
  const arcs = pieGenerator(pieData);

  // Determine what to show in center - find slice by fundId (undefined = show first)
  const displaySlice =
    selectedFundId !== undefined
      ? (pieData.find((s) => s.fundId === selectedFundId) ?? pieData[0])
      : pieData[0];

  return (
    <Pressable
      className="relative"
      onPress={() => onSelectFundId(undefined)}
      style={{ width: size, height: size }}
    >
      <Svg viewBox={`0 0 ${size} ${size}`}>
        <G transform={[{ translateX: center }, { translateY: center }]}>
          {arcs.map((arcDatum) => {
            const pathData = arcGenerator(arcDatum) || "";
            return (
              <AnimatedSlice
                arcDatum={arcDatum}
                color={arcDatum.data.color}
                fundId={arcDatum.data.fundId}
                key={arcDatum.data.label}
                onPress={handleSlicePress}
                pathData={pathData}
                selectedFundId={selectedFundId}
              />
            );
          })}
        </G>
      </Svg>

      <CenterLabel
        displaySlice={displaySlice}
        selectedFundId={selectedFundId}
      />
    </Pressable>
  );
}
