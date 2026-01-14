import { useState } from "react";
import { Text } from "react-native";
import { ScalePressable } from "@/components/scale-pressable";
import { useThemeColor } from "@/components/theme-provider";
import {
  type FundWithMeta,
  getMonthlyBudget,
  TIME_MODE_LABELS,
} from "@/lib/fund";
import { cn } from "@/utils/cn";
import { toCurrencyNarrow } from "@/utils/format";
import { getSavingsColor } from "../category-utils";

const QUICK_STAT_MODES_SPENDING = ["remaining", "percentage", "spent"] as const;
const QUICK_STAT_MODES_NON_NEGOTIABLE = [
  "saved",
  "percentage",
  "target",
] as const;

type Stat = { value: string; label: string; textColor?: string };

type Props = {
  fund: FundWithMeta;
};

export default function QuickStatSpending({ fund }: Props) {
  const [modeIndex, setModeIndex] = useState(0);
  const isNonNegotiable = fund.fundType === "NON_NEGOTIABLE";
  const monthlyBudget = getMonthlyBudget(fund);

  const modes = isNonNegotiable
    ? QUICK_STAT_MODES_NON_NEGOTIABLE
    : QUICK_STAT_MODES_SPENDING;
  const mode = modes[modeIndex % modes.length];

  // Compute savings color for NON_NEGOTIABLE funds (hook called unconditionally)
  const progress = monthlyBudget > 0 ? fund.totalSpent / monthlyBudget : 0;
  const savingsColorKey = getSavingsColor(progress);
  const savingsColor = useThemeColor(savingsColorKey);

  function cycleMode() {
    setModeIndex((prev) => (prev + 1) % modes.length);
  }

  function getNonNegotiableStat(): Stat {
    const amountSaved = fund.totalSpent;
    const percentSaved =
      monthlyBudget > 0 ? (amountSaved / monthlyBudget) * 100 : 0;
    const isFunded = amountSaved >= monthlyBudget;

    switch (mode) {
      case "saved":
        return {
          value: toCurrencyNarrow(amountSaved),
          label: isFunded ? "funded" : "saved",
        };
      case "percentage":
        return {
          value: `${Math.min(Math.round(percentSaved), 100)}%`,
          label: isFunded ? "funded" : "saved",
        };
      case "target":
        return {
          value: toCurrencyNarrow(monthlyBudget),
          label: "target",
        };
      default:
        return { value: "", label: "" };
    }
  }

  function getSpendingStat(): Stat {
    const remaining = monthlyBudget - fund.totalSpent;
    const isOverspent = remaining < 0;
    const percentLeft =
      monthlyBudget > 0 ? (remaining / monthlyBudget) * 100 : 0;

    const textColor =
      isOverspent && mode !== "spent"
        ? "text-destructive"
        : "text-foreground-muted";

    switch (mode) {
      case "remaining":
        return {
          value: toCurrencyNarrow(Math.abs(remaining)),
          label: isOverspent ? "overspent" : TIME_MODE_LABELS[fund.timeMode],
          textColor,
        };
      case "percentage":
        return {
          value: `${Math.abs(Math.round(percentLeft))}%`,
          label: isOverspent ? "over" : "left",
          textColor,
        };
      case "spent":
        return {
          value: toCurrencyNarrow(fund.totalSpent),
          label: "spent",
          textColor,
        };
      default:
        return { value: "", label: "" };
    }
  }

  const { value, label, textColor } = isNonNegotiable
    ? getNonNegotiableStat()
    : getSpendingStat();

  // For NON_NEGOTIABLE, use computed savings color; for SPENDING, use textColor class
  const colorStyle =
    isNonNegotiable && savingsColor ? { color: savingsColor } : undefined;
  const colorClass = isNonNegotiable ? "text-foreground-muted" : textColor;

  return (
    <ScalePressable
      hitSlop={10}
      onPress={cycleMode}
      opacityValue={0.7}
      scaleValue={0.95}
    >
      <Text
        className={cn("font-satoshi text-xs", colorClass)}
        style={colorStyle}
      >
        <Text
          className={cn("font-nunito-bold text-xs", colorClass)}
          style={colorStyle}
        >
          {value}
        </Text>{" "}
        {label}
      </Text>
    </ScalePressable>
  );
}
