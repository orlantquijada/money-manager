import type { TimeMode } from "api";
import { getDaysInMonth } from "date-fns";
import { useColorScheme } from "react-native";
import { StyledLeanText, StyledLeanView } from "@/config/interop";
import { amber, amberDark } from "@/utils/colors";
import { toCurrencyNarrow } from "@/utils/format";

function getPeriodDays(timeMode: TimeMode): { elapsed: number; total: number } {
  const now = new Date();

  if (timeMode === "WEEKLY") {
    const dayOfWeek = now.getDay(); // 0 = Sunday
    return { elapsed: dayOfWeek + 1, total: 7 };
  }

  if (timeMode === "BIMONTHLY") {
    const day = now.getDate();
    if (day <= 15) {
      return { elapsed: day, total: 15 };
    }
    const daysInMonth = getDaysInMonth(now);
    return { elapsed: day - 15, total: daysInMonth - 15 };
  }

  // MONTHLY
  const day = now.getDate();
  const daysInMonth = getDaysInMonth(now);
  return { elapsed: day, total: daysInMonth };
}

type Props = {
  spent: number;
  budget: number;
  timeMode: TimeMode;
};

export default function SpendingPaceWarning({
  spent,
  budget,
  timeMode,
}: Props) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  // Skip for EVENTUALLY funds
  if (timeMode === "EVENTUALLY") {
    return null;
  }

  const { elapsed, total } = getPeriodDays(timeMode);

  // Calculate projected spending
  const dailyRate = elapsed > 0 ? spent / elapsed : 0;
  const projected = dailyRate * total;

  // Only show if projected spending exceeds budget
  if (projected <= budget) {
    return null;
  }

  // Calculate sustainable daily spend
  const remaining = Math.max(budget - spent, 0);
  const daysLeft = total - elapsed;
  const sustainableDaily = daysLeft > 0 ? remaining / daysLeft : 0;

  const amberColors = isDark ? amberDark : amber;

  return (
    <StyledLeanView
      className="rounded-2xl p-4"
      style={{
        borderCurve: "continuous",
        backgroundColor: amberColors.amber3,
        borderWidth: 1,
        borderColor: amberColors.amber7,
      }}
    >
      <StyledLeanText
        className="font-satoshi-medium text-sm"
        style={{ color: amberColors.amber11 }}
      >
        Spending Pace
      </StyledLeanText>
      <StyledLeanText
        className="mt-1 font-nunito-bold text-lg"
        style={{ color: amberColors.amber11 }}
      >
        {toCurrencyNarrow(Math.max(sustainableDaily, 0))}/day to stay on track
      </StyledLeanText>
      <StyledLeanText
        className="mt-1 font-satoshi text-sm"
        style={{ color: amberColors.amber11 }}
      >
        At current pace, you'll spend {toCurrencyNarrow(projected)} this period
      </StyledLeanText>
    </StyledLeanView>
  );
}
