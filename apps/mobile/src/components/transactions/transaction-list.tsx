import type { RouterOutputs } from "api";
import { format, startOfDay } from "date-fns";
import { useRouter } from "expo-router";
import { useCallback, useMemo } from "react";
import {
  RefreshControl,
  SectionList,
  type SectionListData,
} from "react-native";
import { useThemeColor } from "@/components/theme-provider";
import { TransactionDateHeader } from "./date-header";
import { TransactionsEmptyState } from "./empty-state";
import { TransactionRow } from "./transaction-row";

type Transaction = RouterOutputs["transaction"]["allThisMonth"][number];

type TransactionSection = {
  date: Date;
  total: number;
  data: Transaction[];
};

type Props = {
  transactions: Transaction[];
  isRefreshing?: boolean;
  onRefresh?: () => void;
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

    const date = new Date(transaction.date);
    const dayKey = format(startOfDay(date), "yyyy-MM-dd");

    const existing = grouped.get(dayKey);
    if (existing) {
      existing.transactions.push(transaction);
    } else {
      grouped.set(dayKey, {
        date: startOfDay(date),
        transactions: [transaction],
      });
    }
  }

  // Convert to sections with totals
  const sections: TransactionSection[] = [];
  for (const [, group] of grouped) {
    const total = group.transactions.reduce(
      (sum, t) => sum + Number(t.amount),
      0
    );
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
}: Props) {
  const router = useRouter();
  const tintColor = useThemeColor("foreground");

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

  const renderItem = useCallback(
    ({ item }: { item: Transaction }) => (
      <TransactionRow
        onPress={() => handleTransactionPress(item.id)}
        transaction={item}
      />
    ),
    [handleTransactionPress]
  );

  const keyExtractor = useCallback((item: Transaction) => item.id, []);

  if (sections.length === 0) {
    return <TransactionsEmptyState />;
  }

  return (
    <SectionList
      contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
      keyExtractor={keyExtractor}
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
