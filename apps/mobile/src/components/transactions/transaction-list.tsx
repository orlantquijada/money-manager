import { FlashList } from "@shopify/flash-list";
import { startOfDay } from "date-fns";
import { useRouter } from "expo-router";
import { useCallback, useMemo } from "react";
import { ActivityIndicator, RefreshControl } from "react-native";

import { StyledLeanText, StyledLeanView } from "@/config/interop";
import { StyledGlassButton } from "@/config/interop-glass-button";
import { StyledIconSymbol } from "@/config/interop-icon-symbol";
import { toIsoDate } from "@/utils/format";
import { sum } from "@/utils/math";
import { TransactionDateHeader } from "./date-header";
import { TransactionsEmptyState } from "./empty-state";
import { type TransactionItem, TransactionRow } from "./transaction-row";

type ListItem =
  | { type: "header"; date: Date; total: number; id: string }
  | { type: "transaction"; data: TransactionItem };

type Props = {
  transactions: TransactionItem[];
  isRefreshing?: boolean;
  onRefresh?: () => void;
  // Pagination props
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  onLoadMore?: () => void;
  // Empty state props
  emptyStateVariant?: "new-user" | "period-empty";
  periodLabel?: string;
  // Activity tab footer
  showSeeAllLink?: boolean;
  // Layout props
  bottomInset?: number;
  // Keyboard behavior
  keyboardDismissMode?: "none" | "on-drag" | "interactive";
  // Context
  hideFundContext?: boolean;
};

function useFlattenedTransactions(transactions: TransactionItem[]): ListItem[] {
  return useMemo(() => {
    const grouped = new Map<
      string,
      { date: Date; transactions: TransactionItem[] }
    >();

    for (const transaction of transactions) {
      if (!transaction.date) continue;

      const dateDayStart = startOfDay(transaction.date);
      const dayKey = toIsoDate(dateDayStart);

      const existing = grouped.get(dayKey);
      if (existing) {
        existing.transactions.push(transaction);
      } else {
        grouped.set(dayKey, {
          date: dateDayStart,
          transactions: [transaction],
        });
      }
    }

    const sortedGroups = Array.from(grouped.values()).sort(
      (a, b) => b.date.getTime() - a.date.getTime()
    );

    return sortedGroups.flatMap((group) => {
      const total = sum(group.transactions.map(({ amount }) => Number(amount)));
      const header: ListItem = {
        type: "header",
        date: group.date,
        total,
        id: `header-${group.date.getTime()}`,
      };

      const items: ListItem[] = group.transactions.map((txn) => ({
        type: "transaction",
        data: txn,
      }));

      return [header, ...items];
    });
  }, [transactions]);
}

function getItemType(item: ListItem) {
  return item.type;
}

function keyExtractor(item: ListItem) {
  return item.type === "header" ? item.id : item.data.id;
}

function TransactionListFooter({
  showSeeAllLink,
  onSeeAllPress,
  hasNextPage,
  isFetchingNextPage,
  onLoadMore,
}: {
  showSeeAllLink: boolean;
  onSeeAllPress: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  onLoadMore?: () => void;
}) {
  if (showSeeAllLink) {
    return (
      <StyledLeanView className="items-center py-6">
        <StyledGlassButton
          onPress={onSeeAllPress}
          tintColorClassName="accent-muted"
        >
          <StyledLeanView className="flex-row items-center justify-center gap-1">
            <StyledLeanText className="font-satoshi-medium text-foreground">
              See all spending
            </StyledLeanText>
            <StyledIconSymbol
              colorClassName="accent-foreground"
              name="arrow.right"
              size={12}
            />
          </StyledLeanView>
        </StyledGlassButton>
      </StyledLeanView>
    );
  }

  if (!hasNextPage) return null;

  return (
    <StyledLeanView className="items-center py-6">
      <StyledGlassButton
        disabled={isFetchingNextPage}
        onPress={onLoadMore}
        style={{ opacity: isFetchingNextPage ? 0.6 : 1 }}
        tintColorClassName="accent-muted"
      >
        {isFetchingNextPage ? (
          <ActivityIndicator colorClassName="accent-foreground" size="small" />
        ) : (
          <StyledLeanText className="font-satoshi-medium text-foreground">
            Load More
          </StyledLeanText>
        )}
      </StyledGlassButton>
    </StyledLeanView>
  );
}

export function TransactionList({
  transactions,
  isRefreshing = false,
  onRefresh,
  hasNextPage = false,
  isFetchingNextPage = false,
  onLoadMore,
  emptyStateVariant = "period-empty",
  periodLabel,
  showSeeAllLink = false,
  bottomInset = 16,
  keyboardDismissMode,
  hideFundContext = false,
}: Props) {
  const router = useRouter();

  const data = useFlattenedTransactions(transactions);

  const renderItem = useCallback(
    ({ item }: { item: ListItem }) => {
      if (item.type === "header") {
        return <TransactionDateHeader date={item.date} total={item.total} />;
      }
      return (
        <TransactionRow
          hideFundContext={hideFundContext}
          onPress={() =>
            router.push({
              pathname: "/transaction/[id]",
              params: { id: item.data.id },
            })
          }
          transaction={item.data}
        />
      );
    },
    [router, hideFundContext]
  );

  if (data.length === 0) {
    return (
      <TransactionsEmptyState
        periodLabel={periodLabel}
        variant={emptyStateVariant}
      />
    );
  }

  return (
    <FlashList
      contentContainerStyle={{
        paddingHorizontal: 16,
        paddingBottom: bottomInset,
      }}
      contentInsetAdjustmentBehavior="automatic"
      data={data}
      getItemType={getItemType}
      keyboardDismissMode={keyboardDismissMode}
      keyExtractor={keyExtractor}
      ListFooterComponent={
        <TransactionListFooter
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          onLoadMore={onLoadMore}
          onSeeAllPress={() => router.dismissTo("/transactions")}
          showSeeAllLink={showSeeAllLink}
        />
      }
      onEndReached={onLoadMore}
      onEndReachedThreshold={0.5}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            onRefresh={onRefresh}
            refreshing={isRefreshing}
            tintColorClassName="accent-foreground"
          />
        ) : undefined
      }
      renderItem={renderItem}
    />
  );
}
