import { useState } from "react";
import { Text } from "react-native";
import { ScalePressable } from "@/components/scale-pressable";
import {
  type FundWithMeta,
  getMonthlyBudget,
  TIME_MODE_LABELS,
} from "@/lib/fund";
import { cn } from "@/utils/cn";
import { toCurrencyNarrow } from "@/utils/format";
import { getCurrentPeriodIndex } from "./category-utils";

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

export default function BudgetQuickStats({ fund }: Props) {
  const [modeIndex, setModeIndex] = useState(0);
  const isNonNegotiable = fund.fundType === "NON_NEGOTIABLE";
  const monthlyBudget = getMonthlyBudget(fund);

  const modes = isNonNegotiable
    ? QUICK_STAT_MODES_NON_NEGOTIABLE
    : QUICK_STAT_MODES_SPENDING;
  const mode = modes[modeIndex % modes.length];

  function cycleMode() {
    setModeIndex((prev) => (prev + 1) % modes.length);
  }

  // EVENTUALLY funds use non-negotiable stats but with different labels
  const isEventually = fund.timeMode === "EVENTUALLY";

  function getNonNegotiableStat(): Stat {
    const amountSaved = fund.totalSpent;
    const percentSaved =
      monthlyBudget > 0 ? (amountSaved / monthlyBudget) * 100 : 0;
    const isFunded = amountSaved >= monthlyBudget;

    // Show lime color when past halfway (>50%), otherwise muted
    const textColor =
      percentSaved >= 50
        ? "text-quick-stat-non-negotiable"
        : "text-foreground-muted";

    // Compute labels upfront to reduce switch complexity
    let statusLabel: string;
    if (!isFunded) {
      statusLabel = "saved";
    } else if (isEventually) {
      statusLabel = "goal met";
    } else {
      statusLabel = "funded";
    }

    switch (mode) {
      case "saved":
        return {
          value: toCurrencyNarrow(amountSaved),
          label: statusLabel,
          textColor,
        };
      case "percentage":
        return {
          value: `${Math.min(Math.round(percentSaved), 100)}%`,
          label: statusLabel,
          textColor,
        };
      case "target":
        return {
          value: toCurrencyNarrow(monthlyBudget),
          label: isEventually ? "goal" : "target",
          textColor,
        };
      default:
        return { value: "", label: "" };
    }
  }

  function getSpendingStat(): Stat {
    // Calculate budget available through current period (time-aware)
    const currentPeriodIndex = getCurrentPeriodIndex(fund.timeMode);
    const budgetThroughNow = fund.budgetedAmount * (currentPeriodIndex + 1);

    const remaining = budgetThroughNow - fund.totalSpent;
    const isOverspent = remaining < 0;
    const percentLeft =
      budgetThroughNow > 0 ? (remaining / budgetThroughNow) * 100 : 0;

    const textColor =
      isOverspent && mode !== "spent"
        ? "text-destructive"
        : "text-foreground-muted";

    switch (mode) {
      case "remaining":
        return {
          value: toCurrencyNarrow(Math.abs(remaining)),
          label: isOverspent
            ? `over ${TIME_MODE_LABELS[fund.timeMode]}`
            : TIME_MODE_LABELS[fund.timeMode],
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

  const { value, label, textColor } =
    isNonNegotiable || isEventually
      ? getNonNegotiableStat()
      : getSpendingStat();

  return (
    <ScalePressable
      hitSlop={10}
      onPress={cycleMode}
      opacityValue={0.7}
      scaleValue={0.95}
    >
      <Text className={cn("font-satoshi text-xs", textColor)}>
        <Text className={cn("font-nunito-bold text-xs")}>{value}</Text> {label}
      </Text>
    </ScalePressable>
  );
}
