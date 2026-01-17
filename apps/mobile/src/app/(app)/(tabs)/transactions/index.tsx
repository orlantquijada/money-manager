import { useCallback, useMemo, useState } from "react";
import { ActivityIndicator } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { AnimatedTabScreen } from "@/components/animated-tab-screen";
import type { Period } from "@/components/stats/period-chips";
import { useTabBarHeight } from "@/components/tab-bar";
import { TransactionList } from "@/components/transactions";
import {
  HistoryHeader,
  SEARCH_BAR_HEIGHT,
} from "@/components/transactions/history-header";
import { StyledLeanText, StyledLeanView } from "@/config/interop";
import { useDebounce } from "@/hooks/use-debounce";
import { useTransactionList } from "@/hooks/use-transactions";
import type { RouterOutputs } from "@/utils/api";
import { transitions } from "@/utils/motion";

const PERIOD_LABELS: Record<Period, string> = {
  week: "this week",
  month: "this month",
  "3mo": "these 3 months",
  all: "",
};

type Transaction = RouterOutputs["transaction"]["list"]["transactions"][number];

function filterTransactions(transactions: Transaction[], searchQuery: string) {
  if (!searchQuery.trim()) return transactions;
  const query = searchQuery.toLowerCase().trim();
  return transactions.filter((t) => {
    const storeName = t.store?.name?.toLowerCase() ?? "";
    const fundName = t.fund?.name?.toLowerCase() ?? "";
    return storeName.includes(query) || fundName.includes(query);
  });
}

export default function History() {
  const tabBarHeight = useTabBarHeight();

  // Period selection state
  const [period, setPeriod] = useState<Period>("month");

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const isSearchExpanded = useSharedValue(false);

  // Fetch transactions
  const {
    transactions,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
    isRefreshing,
  } = useTransactionList(period);

  // Filter transactions based on search query (store name + fund name)
  const filteredTransactions = useMemo(
    () => filterTransactions(transactions, debouncedSearchQuery),
    [transactions, debouncedSearchQuery]
  );

  // Handle period change - just update state, cache handles the rest
  const handlePeriodChange = useCallback((newPeriod: Period) => {
    setPeriod(newPeriod);
    setSearchQuery(""); // Clear search on period change
  }, []);

  // Search handlers
  const handleSearchChange = useCallback((text: string) => {
    setSearchQuery(text);
  }, []);

  const handleSearchClear = useCallback(() => {
    setSearchQuery("");
  }, []);

  const handleSearchToggle = useCallback(() => {
    isSearchExpanded.value = !isSearchExpanded.value;
  }, [isSearchExpanded]);

  // Animated style for content translation
  const contentAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: withSpring(
          isSearchExpanded.get() ? 0 : -SEARCH_BAR_HEIGHT,
          transitions.snappy
        ),
      },
    ],
  }));

  // Empty state: show search-specific message if searching with no results
  const hasSearchResults = filteredTransactions.length > 0;
  const isSearching = debouncedSearchQuery.trim().length > 0;
  const showSearchEmptyState = isSearching && !hasSearchResults;

  return (
    <AnimatedTabScreen index={3}>
      <StyledLeanView className="flex-1 gap-4 bg-background">
        <HistoryHeader
          isSearchExpanded={isSearchExpanded}
          onPeriodChange={handlePeriodChange}
          onSearchChange={handleSearchChange}
          onSearchClear={handleSearchClear}
          onSearchToggle={handleSearchToggle}
          period={period}
          searchQuery={searchQuery}
        />

        <Animated.View className="flex-1 px-4" style={[contentAnimatedStyle]}>
          {/* Transaction list or search empty state */}
          <StyledLeanView className="flex-1" style={{ marginHorizontal: -16 }}>
            {isLoading && (
              <StyledLeanView className="flex-1 items-center justify-center">
                <ActivityIndicator />
              </StyledLeanView>
            )}
            {!isLoading && showSearchEmptyState && (
              <StyledLeanView className="flex-1 items-center justify-center px-4">
                <StyledLeanText className="text-center font-satoshi-medium text-foreground-muted">
                  No transactions found
                </StyledLeanText>
              </StyledLeanView>
            )}
            {!(isLoading || showSearchEmptyState) && (
              <TransactionList
                bottomInset={tabBarHeight}
                emptyStateVariant="period-empty"
                hasNextPage={hasNextPage && !isSearching}
                isFetchingNextPage={isFetchingNextPage}
                isRefreshing={isRefreshing}
                keyboardDismissMode="on-drag"
                onLoadMore={fetchNextPage}
                onRefresh={refetch}
                periodLabel={PERIOD_LABELS[period]}
                transactions={filteredTransactions}
              />
            )}
          </StyledLeanView>
        </Animated.View>
      </StyledLeanView>
    </AnimatedTabScreen>
  );
}
