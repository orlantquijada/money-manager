import { useCallback, useMemo, useState } from "react";
import { ActivityIndicator } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { TransactionList } from "@/components/transactions";
import {
  HistoryHeader,
  SEARCH_BAR_HEIGHT,
} from "@/components/transactions/history-header";
import { StyledLeanText, StyledLeanView } from "@/config/interop";
import { useDebounce } from "@/hooks/use-debounce";
import { useFabHeight } from "@/hooks/use-fab-height";
import { useTransactionList } from "@/hooks/use-transactions";
import type { RouterOutputs } from "@/utils/api";
import { transitions } from "@/utils/motion";

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

const now = new Date();

export default function History() {
  const fabHeight = useFabHeight();

  // Month selection state
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);

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
  } = useTransactionList(year, month);

  // Filter transactions based on search query (store name + fund name)
  const filteredTransactions = useMemo(
    () => filterTransactions(transactions, debouncedSearchQuery),
    [transactions, debouncedSearchQuery]
  );

  const canGoNext =
    year < now.getFullYear() ||
    (year === now.getFullYear() && month < now.getMonth() + 1);

  const handleMonthChange = useCallback((newYear: number, newMonth: number) => {
    setYear(newYear);
    setMonth(newMonth);
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
  const showTransactionList = !(isLoading || showSearchEmptyState);

  return (
    <StyledLeanView className="flex-1 gap-4 bg-background">
      <HistoryHeader
        canGoNext={canGoNext}
        isSearchExpanded={isSearchExpanded}
        month={month}
        onMonthChange={handleMonthChange}
        onSearchChange={setSearchQuery}
        onSearchClear={() => setSearchQuery("")}
        onSearchToggle={handleSearchToggle}
        searchQuery={searchQuery}
        year={year}
      />

      <Animated.View className="flex-1 px-4" style={contentAnimatedStyle}>
        {/* Transaction list or search empty state */}
        <StyledLeanView className="flex-1" style={{ marginHorizontal: -16 }}>
          {isLoading && (
            <StyledLeanView className="flex-1 items-center justify-center">
              <ActivityIndicator colorClassName="accent-foreground" />
            </StyledLeanView>
          )}
          {!isLoading && showSearchEmptyState && (
            <StyledLeanView className="flex-1 items-center justify-center px-4">
              <StyledLeanText className="text-center font-satoshi-medium text-foreground-muted">
                No transactions found
              </StyledLeanText>
            </StyledLeanView>
          )}
          {showTransactionList && (
            <TransactionList
              bottomInset={fabHeight}
              emptyStateVariant="period-empty"
              hasNextPage={hasNextPage && !isSearching}
              isFetchingNextPage={isFetchingNextPage}
              isRefreshing={isRefreshing}
              keyboardDismissMode="on-drag"
              onLoadMore={fetchNextPage}
              onRefresh={refetch}
              periodLabel="this month"
              transactions={filteredTransactions}
            />
          )}
        </StyledLeanView>
      </Animated.View>
    </StyledLeanView>
  );
}
