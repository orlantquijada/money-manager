import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { RouterOutputs } from "api";
import { useCallback, useEffect, useState } from "react";
import { AnimatedTabScreen } from "@/components/animated-tab-screen";
import PeriodChips, { type Period } from "@/components/stats/period-chips";
import StatsHeader from "@/components/stats/stats-header";
import { useTabBarHeight } from "@/components/tab-bar";
import { TransactionList } from "@/components/transactions";
import { StyledLeanView } from "@/config/interop";
import { trpc } from "@/utils/api";

type TransactionItem =
  RouterOutputs["transaction"]["list"]["transactions"][number];

const PERIOD_LABELS: Record<Period, string> = {
  week: "this week",
  month: "this month",
  "3mo": "these 3 months",
  all: "",
};

export default function Transactions() {
  const queryClient = useQueryClient();
  const tabBarHeight = useTabBarHeight();

  // Period selection state
  const [period, setPeriod] = useState<Period>("month");

  // Pagination state
  const [cursor, setCursor] = useState<string | undefined>();
  const [transactions, setTransactions] = useState<TransactionItem[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Query stats
  const { data: stats, isLoading: statsLoading } = useQuery(
    trpc.transaction.stats.queryOptions({ period })
  );

  // Query list with pagination
  const { data: listData, isFetching: listFetching } = useQuery(
    trpc.transaction.list.queryOptions({ period, cursor, limit: 50 })
  );

  // Accumulate transactions when data changes
  useEffect(() => {
    if (listData?.transactions) {
      setTransactions((prev) =>
        cursor ? [...prev, ...listData.transactions] : listData.transactions
      );
    }
  }, [listData?.transactions, cursor]);

  // Reset when period changes
  const handlePeriodChange = useCallback((newPeriod: Period) => {
    setPeriod(newPeriod);
    setCursor(undefined);
    setTransactions([]);
  }, []);

  // Load more handler
  const handleLoadMore = useCallback(() => {
    if (listData?.nextCursor) {
      setCursor(listData.nextCursor);
    }
  }, [listData?.nextCursor]);

  // Refresh handler
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    setCursor(undefined);
    setTransactions([]);
    await queryClient.invalidateQueries({
      queryKey: ["transaction"],
    });
    setIsRefreshing(false);
  }, [queryClient]);

  // Determine empty state variant
  // "new-user" only if they have no transactions ever (check "all" period with 0 total)
  const isNewUser =
    !statsLoading && stats?.totalSpent === 0 && period === "all";
  const emptyStateVariant = isNewUser ? "new-user" : "period-empty";

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
            <StatsHeader data={stats} isLoading={statsLoading} />
          )}

          <StyledLeanView className="flex-1" style={{ marginHorizontal: -16 }}>
            <TransactionList
              emptyStateVariant={emptyStateVariant}
              hasNextPage={!!listData?.nextCursor}
              isFetchingNextPage={listFetching && !!cursor}
              isRefreshing={isRefreshing}
              onLoadMore={handleLoadMore}
              onRefresh={handleRefresh}
              periodLabel={PERIOD_LABELS[period]}
              transactions={transactions}
            />
          </StyledLeanView>
        </StyledLeanView>
      </StyledLeanView>
    </AnimatedTabScreen>
  );
}
