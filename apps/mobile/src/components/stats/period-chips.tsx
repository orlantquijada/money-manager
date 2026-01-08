import * as Haptics from "expo-haptics";
import { Pressable, Text, View } from "react-native";
import { cn } from "@/utils/cn";

export type Period = "week" | "month" | "3mo" | "all";

const PERIODS: { value: Period; label: string }[] = [
  { value: "week", label: "Week" },
  { value: "month", label: "Month" },
  { value: "3mo", label: "3 mo" },
  { value: "all", label: "All" },
];

type Props = {
  value: Period;
  onChange: (period: Period) => void;
};

export default function PeriodChips({ value, onChange }: Props) {
  return (
    <View className="flex-row gap-2">
      {PERIODS.map((period) => {
        const isActive = value === period.value;
        return (
          <Pressable
            className={cn(
              "rounded-full px-4 py-2",
              isActive ? "bg-foreground" : "border border-border bg-transparent"
            )}
            key={period.value}
            onPress={() => {
              if (value !== period.value) {
                Haptics.selectionAsync();
                onChange(period.value);
              }
            }}
            style={{ borderCurve: "continuous" }}
          >
            <Text
              className={cn(
                "font-satoshi-medium text-sm",
                isActive ? "text-background" : "text-foreground"
              )}
            >
              {period.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
