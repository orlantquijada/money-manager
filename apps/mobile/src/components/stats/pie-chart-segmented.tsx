import { arc, type PieArcDatum, pie } from "d3-shape";
import * as Haptics from "expo-haptics";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Pressable } from "react-native";
import Animated, {
  FadeIn,
  FadeOut,
  useAnimatedProps,
  useDerivedValue,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { G, Path, Svg } from "react-native-svg";
import { AnimatedText } from "@/components/animated-text";
import { StyledLeanView } from "@/config/interop";
import { CHART_COLORS, getChartColor } from "@/lib/chart-colors";
import { transitions } from "@/utils/motion";

const MAX_SLICES = 5;

const SPRING_CONFIG = transitions.snappy;
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
  const midAngle = useMemo(
    () => (arcDatum.startAngle + arcDatum.endAngle) / 2 - Math.PI / 2,
    [arcDatum.startAngle, arcDatum.endAngle]
  );

  // Animation shared values
  const offset = useSharedValue(0);
  const opacity = useSharedValue(1);

  const isFocused = selectedIndex === index;
  const anySelected = selectedIndex !== null;

  useEffect(() => {
    offset.set(withSpring(isFocused ? FOCUS_OFFSET : 0, SPRING_CONFIG));
    opacity.set(
      withSpring(
        anySelected && !isFocused ? UNFOCUSED_OPACITY : 1,
        SPRING_CONFIG
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
        onPress={() => onPress(index)}
      />
    </G>
  );
}

type CenterLabelProps = {
  displaySlice: PieSlice | undefined;
  isSelected: boolean;
  selectedIndex?: number;
};

function CenterLabel({
  displaySlice,
  isSelected,
  selectedIndex,
}: CenterLabelProps) {
  const animatedValue = useSharedValue(displaySlice?.value ?? 0);

  useEffect(() => {
    animatedValue.set(withSpring(displaySlice?.value ?? 0, SPRING_CONFIG));
  }, [displaySlice?.value, animatedValue.set]);

  const animatedText = useDerivedValue(() => {
    return `${Math.round(animatedValue.get())}%`;
  });

  if (!displaySlice) return null;

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
        entering={FadeIn.springify()
          .stiffness(SPRING_CONFIG.stiffness)
          .damping(SPRING_CONFIG.damping)
          .mass(SPRING_CONFIG.mass)}
        exiting={FadeOut.springify()
          .stiffness(SPRING_CONFIG.stiffness)
          .damping(SPRING_CONFIG.damping)
          .mass(SPRING_CONFIG.mass)}
        key={selectedIndex}
        numberOfLines={1}
      >
        {displaySlice.label}
      </Animated.Text>
    </Animated.View>
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

  // Determine what to show in center
  const displaySlice =
    selectedIndex !== null ? pieData[selectedIndex] : pieData[0];
  const isSelected = selectedIndex !== null;

  return (
    <Pressable
      className="relative"
      onPress={() => setSelectedIndex(null)}
      style={{ width: size, height: size }}
    >
      <Svg viewBox={`0 0 ${size} ${size}`}>
        <G transform={[{ translateX: center }, { translateY: center }]}>
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

      <CenterLabel
        displaySlice={displaySlice}
        isSelected={isSelected}
        selectedIndex={selectedIndex}
      />
    </Pressable>
  );
}
