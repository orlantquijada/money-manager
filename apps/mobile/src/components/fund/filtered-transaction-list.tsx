import { Stack } from "expo-router";
import { useMemo, useState } from "react";
import { useThemeColor } from "@/components/theme-provider";
import { TransactionList } from "@/components/transactions";
import { StyledLeanView } from "@/config/interop";
import type { RouterOutputs } from "@/utils/api";

type Transaction =
  RouterOutputs["transaction"]["listByFund"]["transactions"][number];

type Props = {
  transactions: Transaction[];
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  isRefreshing?: boolean;
  onLoadMore?: () => void;
  onRefresh?: () => void;
};

export function FilteredFundTransactionList({
  transactions,
  hasNextPage,
  isFetchingNextPage,
  isRefreshing,
  onLoadMore,
  onRefresh,
}: Props) {
  const [search, setSearch] = useState("");
  const foregroundColor = useThemeColor("foreground");

  const filteredTransactions = useMemo(
    () => filterTransactions(transactions, search),
    [transactions, search]
  );

  return (
    <>
      <Stack.Screen
        options={{
          headerSearchBarOptions: {
            allowToolbarIntegration: false,
            placement: "integrated",
            textColor: foregroundColor,
            onChangeText: (e) => setSearch(e.nativeEvent.text),
          },
        }}
      />
      <StyledLeanView className="flex-1 bg-background">
        <TransactionList
          emptyStateVariant="period-empty"
          hasNextPage={hasNextPage}
          hideFundContext // New prop to indicate fund context
          isFetchingNextPage={isFetchingNextPage}
          isRefreshing={isRefreshing}
          onLoadMore={onLoadMore}
          onRefresh={onRefresh}
          transactions={filteredTransactions}
        />
      </StyledLeanView>
    </>
  );
}

function filterTransactions(transactions: Transaction[], search: string) {
  if (!search) return transactions;
  const lowerSearch = search.toLowerCase();
  return transactions.filter((t) => {
    const amountStr = t.amount.toString();
    const noteMatch = t.note?.toLowerCase().includes(lowerSearch);
    const storeMatch = t.store?.name.toLowerCase().includes(lowerSearch);
    const amountMatch = amountStr.includes(lowerSearch);
    return noteMatch || storeMatch || amountMatch;
  });
}
