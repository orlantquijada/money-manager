import * as Haptics from "expo-haptics";
import { StyledLeanText, StyledLeanView } from "@/config/interop";
import { cn } from "@/utils/cn";
import GlassButton from "../glass-button";
import { useThemeColor } from "../theme-provider";

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
  const backgroundColor = useThemeColor("background");
  const foregroundColor = useThemeColor("foreground");

  return (
    <StyledLeanView className="flex-row gap-2">
      {PERIODS.map((period) => {
        const isActive = value === period.value;

        return (
          <GlassButton
            key={period.value}
            onPress={() => {
              if (value !== period.value) {
                Haptics.selectionAsync();
                onChange(period.value);
              }
            }}
            tintColor={isActive ? foregroundColor : backgroundColor}
            variant="default"
          >
            <StyledLeanText
              className={cn(
                "font-satoshi-medium text-sm",
                isActive ? "text-background" : "text-foreground"
              )}
            >
              {period.label}
            </StyledLeanText>
          </GlassButton>
        );
      })}
    </StyledLeanView>
  );
}
