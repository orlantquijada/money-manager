import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import Button from "@/components/button";
import { BudgetAlerts } from "@/components/stats/budget-alerts";
import PeriodChips, { type Period } from "@/components/stats/period-chips";
import StatsHeader from "@/components/stats/stats-header";
import { StyledLeanText, StyledLeanView } from "@/config/interop";
import { useFabHeight } from "@/hooks/use-fab-height";
import { trpc } from "@/utils/api";

export default function Insights() {
  const router = useRouter();
  const fabHeight = useFabHeight();

  // Period selection state
  const [period, setPeriod] = useState<Period>("month");

  // Query stats
  const { data: stats, isLoading: statsLoading } = useQuery(
    trpc.transaction.stats.queryOptions({ period })
  );

  // Reset when period changes
  const handlePeriodChange = useCallback((newPeriod: Period) => {
    setPeriod(newPeriod);
  }, []);

  // Navigate to alerts modal
  const handleSeeAllAlerts = useCallback(() => {
    router.push("/alerts");
  }, [router]);

  // Navigate to add expense
  const handleAddExpense = useCallback(() => {
    router.navigate("/add-expense");
  }, [router]);

  // Determine empty state variant
  // "new-user" only if they have no transactions ever (check "all" period with 0 total)
  const isNewUser =
    !statsLoading && stats?.totalSpent === 0 && period === "all";

  // Don't show stats header for new user empty state
  const showStatsHeader = !isNewUser;

  return (
    <StyledLeanView
      className="flex-1 bg-background pt-safe"
      style={{ paddingBottom: fabHeight }}
    >
      <StyledLeanView className="flex-1 gap-4 px-4 pt-4">
        {/* Period chips */}
        <PeriodChips
          className="mb-2"
          onChange={handlePeriodChange}
          value={period}
        />

        {/* Stats header - hide for new user */}
        {showStatsHeader && (
          <StatsHeader data={stats} isLoading={statsLoading} period={period} />
        )}

        {/* Empty state for new users */}
        {isNewUser && (
          <StyledLeanView className="flex-1 items-center justify-center gap-4 pt-12">
            <StyledLeanText className="text-center font-satoshi-medium text-foreground-muted">
              No transactions yet
            </StyledLeanText>
            <Button className="h-10 bg-primary px-6" onPress={handleAddExpense}>
              <StyledLeanText className="font-satoshi-bold text-primary-foreground">
                Add first expense
              </StyledLeanText>
            </Button>
          </StyledLeanView>
        )}

        {/* Budget alerts - only show when stats loaded */}
        <BudgetAlerts
          isLoading={statsLoading}
          onSeeAll={handleSeeAllAlerts}
          stats={stats}
        />
      </StyledLeanView>
    </StyledLeanView>
  );
}
