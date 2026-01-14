import { format, startOfDay } from "date-fns";
import { useRouter } from "expo-router";
import { useCallback, useMemo } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  SectionList,
  type SectionListData,
  type SectionListRenderItem,
} from "react-native";
import { useThemeColor } from "@/components/theme-provider";
import { StyledLeanText, StyledLeanView } from "@/config/interop";
import { sum } from "@/utils/math";
import GlassButton from "../glass-button";
import { TransactionDateHeader } from "./date-header";
import { TransactionsEmptyState } from "./empty-state";
import { type TransactionItem, TransactionRow } from "./transaction-row";

type Transaction = TransactionItem;

type TransactionSection = {
  date: Date;
  total: number;
  data: Transaction[];
};

type Props = {
  transactions: Transaction[];
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
};

function groupTransactionsByDate(
  transactions: Transaction[]
): TransactionSection[] {
  const grouped = new Map<
    string,
    { date: Date; transactions: Transaction[] }
  >();

  for (const transaction of transactions) {
    if (!transaction.date) continue;

    const dateDayStart = startOfDay(transaction.date);
    const dayKey = format(dateDayStart, "yyyy-MM-dd");

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

  // Convert to sections with totals
  const sections: TransactionSection[] = [];
  for (const [, group] of grouped) {
    const total = sum(group.transactions.map(({ amount }) => Number(amount)));
    sections.push({
      date: group.date,
      total,
      data: group.transactions,
    });
  }

  // Sort by date descending (most recent first)
  sections.sort((a, b) => b.date.getTime() - a.date.getTime());

  return sections;
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
}: Props) {
  const router = useRouter();
  const tintColor = useThemeColor("foreground");
  const mutedColor = useThemeColor("muted");

  const sections = useMemo(
    () => groupTransactionsByDate(transactions),
    [transactions]
  );

  const handleTransactionPress = useCallback(
    (transactionId: string) => {
      router.push({
        pathname: "/transaction/[id]",
        params: { id: transactionId },
      });
    },
    [router]
  );

  const renderSectionHeader = useCallback(
    ({
      section,
    }: {
      section: SectionListData<Transaction, TransactionSection>;
    }) => <TransactionDateHeader date={section.date} total={section.total} />,
    []
  );

  const renderItem: SectionListRenderItem<TransactionItem, TransactionSection> =
    useCallback(
      ({ item }) => (
        <TransactionRow
          onPress={() => handleTransactionPress(item.id)}
          transaction={item}
        />
      ),
      [handleTransactionPress]
    );

  const keyExtractor = useCallback((item: Transaction) => item.id, []);

  const handleSeeAllPress = useCallback(() => {
    router.push("/(app)/(tabs)/transactions");
  }, [router]);

  const renderFooter = useCallback(() => {
    // "See all spending" link for Activity tab
    if (showSeeAllLink) {
      return (
        <StyledLeanView className="items-center py-6">
          <GlassButton onPress={handleSeeAllPress} tintColor={mutedColor}>
            <StyledLeanText className="font-satoshi-medium text-foreground">
              See all spending →
            </StyledLeanText>
          </GlassButton>
        </StyledLeanView>
      );
    }

    // Pagination footer
    if (!hasNextPage) return null;

    return (
      <StyledLeanView className="items-center py-6">
        <GlassButton
          disabled={isFetchingNextPage}
          onPress={onLoadMore}
          style={{ opacity: isFetchingNextPage ? 0.6 : 1 }}
          tintColor={mutedColor}
          variant="default"
        >
          {isFetchingNextPage ? (
            <ActivityIndicator color={tintColor} size="small" />
          ) : (
            <StyledLeanText className="font-satoshi-medium text-foreground">
              Load More
            </StyledLeanText>
          )}
        </GlassButton>
      </StyledLeanView>
    );
  }, [
    showSeeAllLink,
    handleSeeAllPress,
    hasNextPage,
    isFetchingNextPage,
    onLoadMore,
    tintColor,
    mutedColor,
  ]);

  if (sections.length === 0) {
    return (
      <TransactionsEmptyState
        periodLabel={periodLabel}
        variant={emptyStateVariant}
      />
    );
  }

  return (
    <SectionList
      contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16 }}
      keyExtractor={keyExtractor}
      ListFooterComponent={renderFooter}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            onRefresh={onRefresh}
            refreshing={isRefreshing}
            tintColor={tintColor}
          />
        ) : undefined
      }
      renderItem={renderItem}
      renderSectionHeader={renderSectionHeader}
      sections={sections}
      stickySectionHeadersEnabled={false}
    />
  );
}
