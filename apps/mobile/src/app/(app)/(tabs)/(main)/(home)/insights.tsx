import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useCallback } from "react";
import { ScrollView } from "react-native";
import Button from "@/components/button";
import {
  EnvelopeHealthCard,
  KeyHighlightCard,
  MonthComparisonCard,
  MonthlySummaryCard,
  SpendingBreakdownCard,
  SuggestionCard,
} from "@/components/insights";
import { StyledLeanText, StyledLeanView } from "@/config/interop";
import { useFabHeight } from "@/hooks/use-fab-height";
import { trpc } from "@/utils/api";

export default function Insights() {
  const router = useRouter();
  const fabHeight = useFabHeight();

  const { data: stats, isLoading: statsLoading } = useQuery(
    trpc.insights.monthlyStats.queryOptions()
  );

  const { data: summary, isLoading: summaryLoading } = useQuery({
    ...trpc.insights.summary.queryOptions(),
    staleTime: 5 * 60 * 1000, // 5 minute cache for AI summary
  });

  const handleAddExpense = useCallback(() => {
    router.navigate("/add-expense");
  }, [router]);

  const isNewUser = !statsLoading && stats?.totalSpending === 0;

  return (
    <StyledLeanView className="flex-1 bg-background pt-safe">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 24,
          paddingBottom: fabHeight + 16,
          gap: 12,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Empty state for new users */}
        {isNewUser ? (
          <StyledLeanView className="flex-1 items-center justify-center gap-4 pt-24">
            <StyledLeanText className="text-center font-satoshi-medium text-foreground-muted">
              No insights yet
            </StyledLeanText>
            <StyledLeanText className="px-8 text-center font-satoshi text-foreground-muted text-sm">
              Add some expenses to see your spending insights and AI-powered
              summaries.
            </StyledLeanText>
            <Button
              className="mt-4 h-10 bg-primary px-6"
              onPress={handleAddExpense}
            >
              <StyledLeanText className="font-satoshi-bold text-primary-foreground">
                Add first expense
              </StyledLeanText>
            </Button>
          </StyledLeanView>
        ) : (
          <>
            <MonthlySummaryCard
              isLoading={summaryLoading}
              text={summary?.text}
            />

            <EnvelopeHealthCard
              health={stats?.envelopeHealth}
              isLoading={statsLoading}
            />

            <KeyHighlightCard
              isLoading={statsLoading}
              topLeftover={stats?.topLeftover}
              topOverspent={stats?.topOverspent}
            />

            <MonthComparisonCard
              comparison={stats?.monthComparison}
              isLoading={statsLoading}
            />

            <SpendingBreakdownCard
              breakdown={stats?.spendingBreakdown}
              isLoading={statsLoading}
              totalSpending={stats?.totalSpending}
            />

            <SuggestionCard
              isLoading={statsLoading}
              suggestion={stats?.suggestion}
            />
          </>
        )}
      </ScrollView>
    </StyledLeanView>
  );
}
