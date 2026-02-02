import type { MaterialTopTabNavigationProp } from "@react-navigation/material-top-tabs";
import { useNavigation } from "@react-navigation/native";
import { startOfDay } from "date-fns";
import { useRouter } from "expo-router";
import { useCallback, useMemo } from "react";
import { RefreshControl, ScrollView } from "react-native";
import { StyledLeanText, StyledLeanView } from "@/config/interop";
import { StyledGlassButton } from "@/config/interop-glass-button";
import { StyledIconSymbol } from "@/config/interop-icon-symbol";
import { useFabHeight } from "@/hooks/use-fab-height";
import { toIsoDate } from "@/utils/format";
import { sum } from "@/utils/math";
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
  header?: React.ReactNode;
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

/**
 * ScrollView-based transaction list for the Activity tab.
 * Unlike the full TransactionList, this doesn't need virtualization
 * since we only show a limited set of recent transactions.
 */
export function ActivityTransactionList({
  transactions,
  isRefreshing = false,
  onRefresh,
  header,
}: Props) {
  const router = useRouter();
  const navigation =
    useNavigation<MaterialTopTabNavigationProp<Record<string, object>>>();
  const fabHeight = useFabHeight();

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

  const handleSeeAllPress = useCallback(() => {
    // Get parent navigator (MaterialTopTabs) since we're inside nested tabs
    const parentNav = navigation.getParent();
    if (parentNav) {
      parentNav.navigate("transactions");
    }
  }, [navigation]);

  if (sections.length === 0 && !header) {
    return <TransactionsEmptyState variant="period-empty" />;
  }

  return (
    <ScrollView
      contentContainerStyle={{
        paddingHorizontal: 16,
        paddingBottom: fabHeight + 16,
      }}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            onRefresh={onRefresh}
            refreshing={isRefreshing}
            tintColorClassName="accent-foreground"
          />
        ) : undefined
      }
    >
      {header}

      {sections.length > 0 && (
        <StyledLeanText className="mt-6 font-satoshi-bold text-foreground-muted">
          Recent Spending
        </StyledLeanText>
      )}

      {sections.map((section) => (
        <StyledLeanView key={section.date.toISOString()}>
          <TransactionDateHeader date={section.date} total={section.total} />
          {section.data.map((transaction) => (
            <TransactionRow
              key={transaction.id}
              onPress={() => handleTransactionPress(transaction.id)}
              transaction={transaction}
            />
          ))}
        </StyledLeanView>
      ))}

      {sections.length > 0 && (
        <StyledLeanView className="items-center py-6">
          <StyledGlassButton
            onPress={handleSeeAllPress}
            tintColorClassName="accent-muted"
          >
            <StyledLeanView className="flex-row items-center justify-center gap-1">
              <StyledLeanText className="font-satoshi-medium text-foreground">
                See all spending
              </StyledLeanText>
              <StyledIconSymbol
                colorClassName="accent-foreground"
                name="arrow.up.right"
                size={12}
              />
            </StyledLeanView>
          </StyledGlassButton>
        </StyledLeanView>
      )}
    </ScrollView>
  );
}
