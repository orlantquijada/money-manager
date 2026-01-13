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

type Props = {
  fund: FundWithMeta;
};

export default function QuickStatSpending({ fund }: Props) {
  const [modeIndex, setModeIndex] = useState(0);
  const isNonNegotiable = fund.fundType === "NON_NEGOTIABLE";

  const modes = isNonNegotiable
    ? QUICK_STAT_MODES_NON_NEGOTIABLE
    : QUICK_STAT_MODES_SPENDING;
  const mode = modes[modeIndex % modes.length];

  const monthlyBudget = getMonthlyBudget(fund);

  const cycleMode = () => {
    setModeIndex((prev) => (prev + 1) % modes.length);
  };

  // NON_NEGOTIABLE funds: savings accumulation
  if (isNonNegotiable) {
    const amountSaved = fund.totalSpent;
    const percentSaved =
      monthlyBudget > 0 ? (amountSaved / monthlyBudget) * 100 : 0;
    const isFunded = amountSaved >= monthlyBudget;

    // Color based on savings progress
    const progress = monthlyBudget > 0 ? amountSaved / monthlyBudget : 0;
    const successColorKey = getSavingsColor(progress);
    const successColor = useThemeColor(successColorKey);

    const getStat = (): { value: string; label: string } => {
      switch (mode) {
        case "saved":
          if (isFunded) {
            return {
              value: toCurrencyNarrow(amountSaved),
              label: "funded",
            };
          }
          return {
            value: toCurrencyNarrow(amountSaved),
            label: "saved",
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
    };

    const { value, label } = getStat();

    return (
      <ScalePressable
        hitSlop={10}
        onPress={cycleMode}
        opacityValue={0.7}
        scaleValue={0.95}
      >
        <Text
          className="font-satoshi text-foreground-muted text-xs"
          style={successColor ? { color: successColor } : undefined}
        >
          <Text
            className="font-nunito-bold text-xs"
            style={successColor ? { color: successColor } : undefined}
          >
            {value}
          </Text>{" "}
          {label}
        </Text>
      </ScalePressable>
    );
  }

  // SPENDING funds: spending depletion (original behavior)
  const remaining = monthlyBudget - fund.totalSpent;
  const isOverspent = remaining < 0;
  const percentLeft = monthlyBudget > 0 ? (remaining / monthlyBudget) * 100 : 0;

  const textColor =
    isOverspent && mode !== "spent"
      ? "text-destructive"
      : "text-foreground-muted";

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
    <ScalePressable
      hitSlop={10}
      onPress={cycleMode}
      opacityValue={0.7}
      scaleValue={0.95}
    >
      <Text className={cn("font-satoshi text-xs", textColor)}>
        <Text className={cn("font-nunito-bold text-xs", textColor)}>
          {value}
        </Text>{" "}
        {label}
      </Text>
    </ScalePressable>
  );
}
