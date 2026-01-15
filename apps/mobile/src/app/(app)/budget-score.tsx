import { useQuery } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { useThemeColor } from "@/components/theme-provider";
import { StyledLeanText, StyledLeanView } from "@/config/interop";
import { trpc } from "@/utils/api";
import { cn } from "@/utils/cn";

export default function BudgetScoreModal() {
  const backgroundColor = useThemeColor("background");
  const foregroundColor = useThemeColor("foreground");
  const { data, isLoading } = useQuery(trpc.budget.score.queryOptions());

  const score = data?.score ?? 0;
  const status = data?.status ?? "on_track";
  const factors = data?.factors ?? [];
  const emoji = getStatusEmoji(status);
  const statusLabel = getStatusLabel(status);

  return (
    <>
      <Stack.Screen
        options={{
          title: "Budget Score",
          headerTintColor: foregroundColor,
          headerStyle: { backgroundColor },
        }}
      />

      <StyledLeanView className="flex-1 bg-background px-6 pt-4">
        {isLoading ? null : (
          <>
            <StyledLeanView className="mb-4 flex-row items-center gap-2">
              <StyledLeanText className="font-satoshi-bold text-foreground text-xl">
                Budget Score: {score}
              </StyledLeanText>
              <StyledLeanText className="text-xl">{emoji}</StyledLeanText>
            </StyledLeanView>

            {factors.length > 0 ? (
              <StyledLeanView className="gap-1">
                {factors.map((factor) => (
                  <FactorRow
                    description={factor.description}
                    key={factor.description}
                    points={factor.points}
                  />
                ))}

                <StyledLeanView className="my-2 h-px bg-border-secondary" />

                <StyledLeanView className="flex-row items-center justify-between">
                  <StyledLeanText className="font-nunito-bold text-foreground text-lg">
                    {score}
                  </StyledLeanText>
                  <StyledLeanText className="font-satoshi-medium text-base text-foreground-muted">
                    {statusLabel}
                  </StyledLeanText>
                </StyledLeanView>
              </StyledLeanView>
            ) : (
              <StyledLeanText className="font-satoshi-medium text-base text-foreground-muted">
                No budgeted funds yet. Add budgets to your funds to track your
                score.
              </StyledLeanText>
            )}
          </>
        )}
      </StyledLeanView>
    </>
  );
}

type FactorRowProps = {
  description: string;
  points: number;
};

function FactorRow({ description, points }: FactorRowProps) {
  const isPositive = points > 0;
  const sign = isPositive ? "+" : "";

  return (
    <StyledLeanView className="flex-row items-center gap-3">
      <StyledLeanText
        className={cn(
          "w-10 font-nunito-bold text-base",
          isPositive ? "text-lime-11" : "text-red-11"
        )}
      >
        {sign}
        {points}
      </StyledLeanText>
      <StyledLeanText
        className="flex-1 font-satoshi-medium text-base text-foreground"
        ellipsizeMode="tail"
        numberOfLines={1}
      >
        {description}
      </StyledLeanText>
    </StyledLeanView>
  );
}

function getStatusEmoji(
  status: "on_track" | "needs_attention" | "over_budget"
): string {
  switch (status) {
    case "on_track":
      return "\u{1F7E2}"; // Green circle
    case "needs_attention":
      return "\u{1F7E1}"; // Yellow circle
    case "over_budget":
      return "\u{1F534}"; // Red circle
    default:
      return "\u{1F7E2}";
  }
}

function getStatusLabel(
  status: "on_track" | "needs_attention" | "over_budget"
): string {
  switch (status) {
    case "on_track":
      return "On Track";
    case "needs_attention":
      return "Needs Attention";
    case "over_budget":
      return "Over Budget";
    default:
      return "On Track";
  }
}
