import { arc, type PieArcDatum, pie } from "d3-shape";
import * as Haptics from "expo-haptics";
import { useCallback, useEffect, useState } from "react";
import { Text, View } from "react-native";
import Animated, {
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { G, Path, Svg } from "react-native-svg";
import { CHART_COLORS, getChartColor } from "@/lib/chart-colors";

const MAX_SLICES = 5;

// Animation constants (from spec)
const SPRING_CONFIG = { damping: 15, stiffness: 150 };
const FOCUS_OFFSET = 10; // radial pop-out distance in px
const UNFOCUSED_OPACITY = 0.3;
const CROSSFADE_DURATION = 200;

// Chart geometry constants
const PAD_ANGLE = 0.04; // ~2-3px gaps between slices
const CORNER_RADIUS = 12; // pill-shaped rounded corners
const INNER_RADIUS_RATIO = 0.5; // 50% inner radius (donut)

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

// Create animated components
const AnimatedPath = Animated.createAnimatedComponent(Path);

type AnimatedSliceProps = {
  arcDatum: PieArcDatum<PieSlice>;
  pathData: string;
  color: string;
  index: number;
  selectedIndex: number | null;
  onPress: (index: number) => void;
};

function AnimatedSlice({
  arcDatum,
  pathData,
  color,
  index,
  selectedIndex,
  onPress,
}: AnimatedSliceProps) {
  // Calculate middle angle for radial offset direction
  // Subtract PI/2 to convert from d3's coordinate system (0 = 12 o'clock)
  const midAngle = (arcDatum.startAngle + arcDatum.endAngle) / 2 - Math.PI / 2;

  // Animation shared values
  const offset = useSharedValue(0);
  const opacity = useSharedValue(1);
  const shadowOpacity = useSharedValue(0);

  const isFocused = selectedIndex === index;
  const anySelected = selectedIndex !== null;

  // Update animations when selection changes
  useEffect(() => {
    offset.value = withSpring(isFocused ? FOCUS_OFFSET : 0, SPRING_CONFIG);
    opacity.value = withSpring(
      anySelected && !isFocused ? UNFOCUSED_OPACITY : 1,
      SPRING_CONFIG
    );
    shadowOpacity.value = withSpring(isFocused ? 0.25 : 0, SPRING_CONFIG);
  }, [isFocused, anySelected, offset, opacity, shadowOpacity]);

  // Compute translation for radial pop-out
  const translateX = Math.cos(midAngle);
  const translateY = Math.sin(midAngle);

  // Animated props for main slice
  const animatedSliceProps = useAnimatedProps(() => ({
    opacity: opacity.value,
    transform: [
      { translateX: translateX * offset.value },
      { translateY: translateY * offset.value },
    ],
  }));

  // Animated props for shadow
  const animatedShadowProps = useAnimatedProps(() => ({
    opacity: shadowOpacity.value,
    transform: [
      { translateX: translateX * offset.value + 2 },
      { translateY: translateY * offset.value + 2 },
    ],
  }));

  return (
    <G>
      {/* Shadow layer - slightly offset */}
      <AnimatedPath
        animatedProps={animatedShadowProps}
        d={pathData}
        fill="rgba(0,0,0,0.15)"
      />
      {/* Main slice */}
      <AnimatedPath
        animatedProps={animatedSliceProps}
        d={pathData}
        fill={color}
        onPress={() => onPress(index)}
      />
    </G>
  );
}

type CenterLabelProps = {
  displaySlice: PieSlice | undefined;
  isSelected: boolean;
};

function CenterLabel({ displaySlice, isSelected }: CenterLabelProps) {
  const defaultOpacity = useSharedValue(1);
  const selectedOpacity = useSharedValue(0);

  useEffect(() => {
    defaultOpacity.value = withTiming(isSelected ? 0 : 1, {
      duration: CROSSFADE_DURATION,
    });
    selectedOpacity.value = withTiming(isSelected ? 1 : 0, {
      duration: CROSSFADE_DURATION,
    });
  }, [isSelected, defaultOpacity, selectedOpacity]);

  const defaultStyle = useAnimatedStyle(() => ({
    opacity: defaultOpacity.value,
    position: "absolute" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  }));

  const selectedStyle = useAnimatedStyle(() => ({
    opacity: selectedOpacity.value,
    position: "absolute" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  }));

  if (!displaySlice) return null;

  return (
    <View
      className="absolute items-center justify-center"
      pointerEvents="none"
      style={{ top: 0, left: 0, right: 0, bottom: 0 }}
    >
      {/* Default state: fund name + amount */}
      <Animated.View style={defaultStyle}>
        <Text
          className="max-w-[80%] text-center font-satoshi-medium text-foreground text-xs"
          ellipsizeMode="tail"
          numberOfLines={1}
        >
          {displaySlice.label}
        </Text>
        <Text className="font-nunito-bold text-foreground text-sm">
          {currencyFormatter.format(displaySlice.amount)}
        </Text>
      </Animated.View>

      {/* Selected state: percentage + fund name */}
      <Animated.View style={selectedStyle}>
        <Text className="font-nunito-bold text-2xl text-foreground">
          {Math.round(displaySlice.value)}%
        </Text>
        <Text
          className="max-w-[80%] text-center font-satoshi-medium text-foreground text-xs"
          ellipsizeMode="tail"
          numberOfLines={1}
        >
          {displaySlice.label}
        </Text>
      </Animated.View>
    </View>
  );
}

export default function SpendingPieChartSegmented({ data, size = 150 }: Props) {
  const pieData = preparePieData(data);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handleSlicePress = useCallback((index: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // Toggle selection - tapping same slice deselects it
    setSelectedIndex((prev) => (prev === index ? null : index));
  }, []);

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

  // Calculate chart geometry
  const outerRadius = size / 2;
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

  // Determine what to show in center
  const displaySlice =
    selectedIndex !== null ? pieData[selectedIndex] : pieData[0];
  const isSelected = selectedIndex !== null;

  return (
    <View style={{ width: size, height: size }}>
      <Svg height={size} viewBox={`0 0 ${size} ${size}`} width={size}>
        <G x={center} y={center}>
          {arcs.map((arcDatum, index) => {
            const pathData = arcGenerator(arcDatum) || "";
            return (
              <AnimatedSlice
                arcDatum={arcDatum}
                color={arcDatum.data.color}
                index={index}
                key={arcDatum.data.label}
                onPress={handleSlicePress}
                pathData={pathData}
                selectedIndex={selectedIndex}
              />
            );
          })}
        </G>
      </Svg>

      <CenterLabel displaySlice={displaySlice} isSelected={isSelected} />
    </View>
  );
}
