import type { MaterialTopTabNavigationProp } from "@react-navigation/material-top-tabs";
import { useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useCallback, useMemo } from "react";
import { RefreshControl, ScrollView } from "react-native";
import { StyledLeanText, StyledLeanView } from "@/config/interop";
import { StyledGlassButton } from "@/config/interop-glass-button";
import { StyledIconSymbol } from "@/config/interop-icon-symbol";
import { useFabHeight } from "@/hooks/use-fab-height";
import { groupTransactionsByDate } from "@/utils/transaction";
import { TransactionDateHeader } from "./date-header";
import { TransactionsEmptyState } from "./empty-state";
import { type TransactionItem, TransactionRow } from "./transaction-row";

type Props = {
  transactions: TransactionItem[];
  isRefreshing?: boolean;
  onRefresh?: () => void;
  header?: React.ReactNode;
};

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
