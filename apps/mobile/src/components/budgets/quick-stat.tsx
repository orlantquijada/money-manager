import { useState } from "react";
import { Text } from "react-native";
import { ScalePressable } from "@/components/scale-pressable";
import { type FundWithMeta, getMonthlyBudget } from "@/lib/fund";
import { cn } from "@/utils/cn";
import { toWholeCurrency } from "@/utils/format";
import { getCurrentPeriodIndex } from "./category-utils";

const QUICK_STAT_MODES_SPENDING = ["remaining", "percentage", "spent"] as const;
const QUICK_STAT_MODES_NON_NEGOTIABLE = [
  "saved",
  "percentage",
  "target",
] as const;

type Stat = { label: string; value: string; textColor?: string };

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
          label: statusLabel,
          value: toWholeCurrency(amountSaved),
          textColor,
        };
      case "percentage":
        return {
          label: statusLabel,
          value: `${Math.min(Math.round(percentSaved), 100)}%`,
          textColor,
        };
      case "target":
        return {
          label: isEventually ? "goal" : "target",
          value: toWholeCurrency(monthlyBudget),
          textColor,
        };
      default:
        return { label: "", value: "" };
    }
  }

  function getSpendingStat(): Stat {
    // Calculate budget available through current period (rolling budget)
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
          label: isOverspent ? "over" : "left",
          value: toWholeCurrency(Math.abs(remaining)),
          textColor,
        };
      case "percentage":
        // No label when under budget, "over" prefix when overspent
        return {
          label: isOverspent ? "over" : "",
          value: `${Math.abs(Math.round(percentLeft))}%`,
          textColor,
        };
      case "spent":
        return {
          label: "spent",
          value: toWholeCurrency(fund.totalSpent),
          textColor,
        };
      default:
        return { label: "", value: "" };
    }
  }

  const { label, value, textColor } =
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
        {label && <Text>{label} </Text>}
        <Text className="font-nunito-bold">{value}</Text>
      </Text>
    </ScalePressable>
  );
}
