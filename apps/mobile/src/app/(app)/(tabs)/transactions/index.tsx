import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { RouterOutputs } from "api";
import { Stack } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import type {
  NativeSyntheticEvent,
  TextInputFocusEventData,
} from "react-native";
import { AnimatedTabScreen } from "@/components/animated-tab-screen";
import PeriodChips, { type Period } from "@/components/stats/period-chips";
import { useTabBarHeight } from "@/components/tab-bar";
import { useThemeColor } from "@/components/theme-provider";
import { TransactionList } from "@/components/transactions";
import { StyledLeanText, StyledLeanView } from "@/config/interop";
import { trpc } from "@/utils/api";

type TransactionItem =
  RouterOutputs["transaction"]["list"]["transactions"][number];

const PERIOD_LABELS: Record<Period, string> = {
  week: "this week",
  month: "this month",
  "3mo": "these 3 months",
  all: "",
};

export default function History() {
  const queryClient = useQueryClient();
  const tabBarHeight = useTabBarHeight();
  const backgroundColor = useThemeColor("background");
  const foregroundColor = useThemeColor("foreground");

  // Period selection state
  const [period, setPeriod] = useState<Period>("month");

  // Search state
  const [searchQuery, setSearchQuery] = useState("");

  // Pagination state
  const [cursor, setCursor] = useState<string | undefined>();
  const [transactions, setTransactions] = useState<TransactionItem[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

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

  // Filter transactions based on search query (store name + fund name)
  const filteredTransactions = useMemo(() => {
    if (!searchQuery.trim()) return transactions;
    const query = searchQuery.toLowerCase().trim();
    return transactions.filter((t) => {
      const storeName = t.store?.name?.toLowerCase() ?? "";
      const fundName = t.fund?.name?.toLowerCase() ?? "";
      return storeName.includes(query) || fundName.includes(query);
    });
  }, [transactions, searchQuery]);

  // Reset when period changes
  const handlePeriodChange = useCallback((newPeriod: Period) => {
    setPeriod(newPeriod);
    setCursor(undefined);
    setTransactions([]);
    setSearchQuery(""); // Clear search on period change
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

  // Search handler for native search bar
  const handleSearchChange = useCallback(
    (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
      setSearchQuery(e.nativeEvent.text);
    },
    []
  );

  const handleSearchClear = useCallback(() => {
    setSearchQuery("");
  }, []);

  // Empty state: show search-specific message if searching with no results
  const hasSearchResults = filteredTransactions.length > 0;
  const isSearching = searchQuery.trim().length > 0;
  const showSearchEmptyState = isSearching && !hasSearchResults;

  return (
    <>
      <Stack.Screen
        options={{
          title: "History",
          headerLargeTitle: true,
          headerLargeTitleShadowVisible: false,
          headerShadowVisible: false,
          headerStyle: { backgroundColor },
          headerTitleStyle: {
            fontFamily: "Satoshi-Bold",
            color: foregroundColor,
          },
          headerLargeTitleStyle: {
            fontFamily: "Satoshi-Bold",
            color: foregroundColor,
          },
          headerSearchBarOptions: {
            placeholder: "Search stores or funds",
            onChangeText: handleSearchChange,
            onCancelButtonPress: handleSearchClear,
            onClose: handleSearchClear,
          },
        }}
      />
      <AnimatedTabScreen index={3}>
        <StyledLeanView
          className="flex-1 bg-background"
          style={{ paddingBottom: tabBarHeight }}
        >
          <StyledLeanView className="flex-1 gap-4 px-4 pt-4">
            {/* Period chips */}
            <PeriodChips
              className="mb-2"
              onChange={handlePeriodChange}
              value={period}
            />

            {/* Transaction list or search empty state */}
            <StyledLeanView
              className="flex-1"
              style={{ marginHorizontal: -16 }}
            >
              {showSearchEmptyState ? (
                <StyledLeanView className="flex-1 items-center justify-center px-4">
                  <StyledLeanText className="text-center font-satoshi-medium text-foreground-muted">
                    No transactions found
                  </StyledLeanText>
                </StyledLeanView>
              ) : (
                <TransactionList
                  emptyStateVariant="period-empty"
                  hasNextPage={!!listData?.nextCursor && !isSearching}
                  isFetchingNextPage={listFetching && !!cursor}
                  isRefreshing={isRefreshing}
                  onLoadMore={handleLoadMore}
                  onRefresh={handleRefresh}
                  periodLabel={PERIOD_LABELS[period]}
                  transactions={filteredTransactions}
                />
              )}
            </StyledLeanView>
          </StyledLeanView>
        </StyledLeanView>
      </AnimatedTabScreen>
    </>
  );
}
