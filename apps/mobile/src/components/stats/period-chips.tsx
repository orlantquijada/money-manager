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
  className?: string;
};

export default function PeriodChips({ value, onChange, className }: Props) {
  const backgroundColor = useThemeColor("background");
  const foregroundColor = useThemeColor("foreground");

  return (
    <StyledLeanView
      className={cn("flex-row items-center justify-center gap-2", className)}
    >
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
            size="sm"
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
