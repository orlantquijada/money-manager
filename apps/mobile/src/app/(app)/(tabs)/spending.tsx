import { useQuery } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { AnimatedTabScreen } from "@/components/animated-tab-screen";
import PeriodChips, { type Period } from "@/components/stats/period-chips";
import StatsHeader from "@/components/stats/stats-header";
import { useTabBarHeight } from "@/components/tab-bar";
import { StyledLeanView } from "@/config/interop";
import { trpc } from "@/utils/api";

export default function Transactions() {
  const tabBarHeight = useTabBarHeight();

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

  // Determine empty state variant
  // "new-user" only if they have no transactions ever (check "all" period with 0 total)
  const isNewUser =
    !statsLoading && stats?.totalSpent === 0 && period === "all";

  // Don't show stats header for new user empty state
  const showStatsHeader = !isNewUser;

  return (
    <AnimatedTabScreen index={2}>
      <StyledLeanView
        className="flex-1 bg-background pt-safe"
        style={{ paddingBottom: tabBarHeight }}
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
            <StatsHeader
              data={stats}
              isLoading={statsLoading}
              period={period}
            />
          )}
        </StyledLeanView>
      </StyledLeanView>
    </AnimatedTabScreen>
  );
}
