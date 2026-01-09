import { useRouter } from "expo-router";
import { Pressable } from "react-native";
import { useThemeColor } from "@/components/theme-provider";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { StyledLeanText, StyledLeanView } from "@/config/interop";

type Props = {
  variant: "new-user" | "period-empty";
  periodLabel?: string;
};

export function TransactionsEmptyState({
  variant,
  periodLabel = "this period",
}: Props) {
  const router = useRouter();
  const iconColor = useThemeColor("foreground-muted");

  if (variant === "new-user") {
    return (
      <StyledLeanView className="flex-1 items-center justify-center px-8 py-16">
        <IconSymbol color={iconColor} name="chart.pie" size={48} />

        <StyledLeanText className="mt-4 font-satoshi-medium text-foreground text-lg">
          No transactions yet
        </StyledLeanText>

        <StyledLeanText className="mt-2 text-center font-satoshi text-base text-foreground-muted">
          Start tracking your expenses by adding your first transaction.
        </StyledLeanText>

        <Pressable
          className="mt-6 rounded-full bg-foreground px-6 py-3"
          onPress={() => router.navigate("/(app)/(tabs)/add-expense")}
          style={{ borderCurve: "continuous" }}
        >
          <StyledLeanText className="font-satoshi-medium text-background text-base">
            Go to Add Expense
          </StyledLeanText>
        </Pressable>
      </StyledLeanView>
    );
  }

  // period-empty variant
  return (
    <StyledLeanView className="flex-1 items-center justify-center px-8 py-16">
      <StyledLeanText className="font-satoshi-medium text-base text-foreground">
        No spending {periodLabel}
      </StyledLeanText>

      <StyledLeanText className="mt-2 font-satoshi text-foreground-muted text-sm">
        Try selecting a different period
      </StyledLeanText>
    </StyledLeanView>
  );
}
