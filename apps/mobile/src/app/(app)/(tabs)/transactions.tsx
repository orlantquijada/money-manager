import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { RouterOutputs } from "api";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Keyboard, TextInput } from "react-native";
import { AnimatedTabScreen } from "@/components/animated-tab-screen";
import { ScalePressable } from "@/components/scale-pressable";
import PeriodChips, { type Period } from "@/components/stats/period-chips";
import { useTabBarHeight } from "@/components/tab-bar";
import { useThemeColor } from "@/components/theme-provider";
import { TransactionList } from "@/components/transactions";
import { IconSymbol } from "@/components/ui/icon-symbol.ios";
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
  const foregroundColor = useThemeColor("foreground");
  const mutedColor = useThemeColor("foreground-muted");

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

  // Clear search
  const handleClearSearch = useCallback(() => {
    setSearchQuery("");
    Keyboard.dismiss();
  }, []);

  // Empty state: show search-specific message if searching with no results
  const hasSearchResults = filteredTransactions.length > 0;
  const isSearching = searchQuery.trim().length > 0;
  const showSearchEmptyState = isSearching && !hasSearchResults;

  return (
    <AnimatedTabScreen index={3}>
      <StyledLeanView
        className="flex-1 bg-background pt-safe"
        style={{ paddingBottom: tabBarHeight }}
      >
        <StyledLeanView className="flex-1 gap-4 px-4 pt-4">
          {/* Large title header */}
          <StyledLeanText className="font-satoshi-bold text-3xl text-foreground">
            History
          </StyledLeanText>

          {/* Search bar */}
          <StyledLeanView
            className="h-10 flex-row items-center gap-2 rounded-xl bg-muted px-3"
            style={{ borderCurve: "continuous" }}
          >
            <IconSymbol color={mutedColor} name="magnifyingglass" size={16} />
            <TextInput
              className="h-full flex-1 font-satoshi text-base text-foreground placeholder:text-foreground-muted"
              cursorColor={foregroundColor}
              onChangeText={setSearchQuery}
              placeholder="Search stores or funds"
              placeholderTextColor={mutedColor}
              returnKeyType="search"
              selectionColor={foregroundColor}
              style={{ lineHeight: undefined }}
              value={searchQuery}
            />
            {searchQuery.length > 0 && (
              <ScalePressable hitSlop={8} onPress={handleClearSearch}>
                <IconSymbol
                  color={mutedColor}
                  name="xmark.circle.fill"
                  size={18}
                />
              </ScalePressable>
            )}
          </StyledLeanView>

          {/* Period chips */}
          <PeriodChips
            className="mb-2"
            onChange={handlePeriodChange}
            value={period}
          />

          {/* Transaction list or search empty state */}
          <StyledLeanView className="flex-1" style={{ marginHorizontal: -16 }}>
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
  );
}
