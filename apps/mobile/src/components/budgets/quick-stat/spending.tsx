import { useState } from "react";
import { Pressable, Text } from "react-native";
import {
  type FundWithMeta,
  getMonthlyBudget,
  TIME_MODE_LABELS,
} from "@/lib/fund";
import { cn } from "@/utils/cn";
import { toCurrencyNarrow } from "@/utils/format";

const QUICK_STAT_MODES = ["remaining", "percentage", "spent"] as const;

type Props = {
  fund: FundWithMeta;
};

export default function QuickStatSpending({ fund }: Props) {
  const [modeIndex, setModeIndex] = useState(0);
  const mode = QUICK_STAT_MODES[modeIndex];

  const monthlyBudget = getMonthlyBudget(fund);
  const remaining = monthlyBudget - fund.totalSpent;
  const isOverspent = remaining < 0;
  const percentLeft = monthlyBudget > 0 ? (remaining / monthlyBudget) * 100 : 0;

  const cycleMode = () => {
    setModeIndex((prev) => (prev + 1) % QUICK_STAT_MODES.length);
  };

  const textColor =
    isOverspent && mode !== "spent" ? "text-red9" : "text-mauve9";

  const getStat = (): { value: string; label: string } => {
    switch (mode) {
      case "remaining":
        if (isOverspent) {
          return {
            value: toCurrencyNarrow(Math.abs(remaining)),
            label: "overspent",
          };
        }
        return {
          value: toCurrencyNarrow(remaining),
          label: TIME_MODE_LABELS[fund.timeMode],
        };
      case "percentage":
        if (isOverspent) {
          return {
            value: `${Math.abs(Math.round(percentLeft))}%`,
            label: "over",
          };
        }
        return {
          value: `${Math.round(percentLeft)}%`,
          label: "left",
        };
      case "spent":
        return {
          value: toCurrencyNarrow(fund.totalSpent),
          label: "spent",
        };
      default:
        return { value: "", label: "" };
    }
  };

  const { value, label } = getStat();

  return (
    <Pressable
      className="transition-all active:scale-95 active:opacity-70"
      hitSlop={10}
      onPress={cycleMode}
    >
      <Text className={cn("font-satoshi text-xs", textColor)}>
        <Text className={cn("font-nunito-bold text-xs", textColor)}>
          {value}
        </Text>{" "}
        {label}
      </Text>
    </Pressable>
  );
}
