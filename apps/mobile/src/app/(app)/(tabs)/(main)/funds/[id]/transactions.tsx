import { useQuery } from "@tanstack/react-query";
import { Stack, useLocalSearchParams } from "expo-router";
import { FilteredFundTransactionList } from "@/components/fund/filtered-transaction-list";
import { useThemeColor } from "@/components/theme-provider";
import { StyledLeanText, StyledLeanView } from "@/config/interop";
import { useFundTransactions } from "@/hooks/use-transactions";
import type { RouterOutputs } from "@/utils/api";
import { trpc } from "@/utils/api";

export default function FundTransactionsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const fundId = Number(id);
  const foregroundColor = useThemeColor("foreground");

  // Query fund for header
  const { data: fund, isLoading: fundLoading } = useQuery(
    trpc.fund.retrieve.queryOptions(fundId)
  );

  // Fetch transactions
  const {
    transactions,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
    isRefreshing,
  } = useFundTransactions(fundId);

  return (
    <>
      <Stack.Screen
        options={{
          headerSearchBarOptions: {
            allowToolbarIntegration: false,
            placement: "integrated",
            textColor: foregroundColor,
          },
        }}
      />
      <FundTransactionsContent
        fund={fund}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        isLoading={fundLoading}
        isRefreshing={isRefreshing}
        onLoadMore={fetchNextPage}
        onRefresh={refetch}
        transactions={transactions}
      />
    </>
  );
}

type Transaction =
  RouterOutputs["transaction"]["listByFund"]["transactions"][number];
type Fund = RouterOutputs["fund"]["retrieve"];

type ContentProps = {
  isLoading: boolean;
  fund: Fund | undefined | null;
  transactions: Transaction[];
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  isRefreshing?: boolean;
  onLoadMore?: () => void;
  onRefresh?: () => void;
};

function FundTransactionsContent({
  isLoading,
  fund,
  transactions,
  hasNextPage,
  isFetchingNextPage,
  isRefreshing,
  onLoadMore,
  onRefresh,
}: ContentProps) {
  if (isLoading) {
    return (
      <StyledLeanView className="flex-1 items-center justify-center bg-background">
        <StyledLeanText className="text-foreground-muted">
          Loading...
        </StyledLeanText>
      </StyledLeanView>
    );
  }

  if (!fund) {
    return (
      <StyledLeanView className="flex-1 items-center justify-center bg-background">
        <StyledLeanText className="text-foreground-muted">
          Fund not found
        </StyledLeanText>
      </StyledLeanView>
    );
  }

  return (
    <FilteredFundTransactionList
      hasNextPage={hasNextPage}
      isFetchingNextPage={isFetchingNextPage}
      isRefreshing={isRefreshing}
      onLoadMore={onLoadMore}
      onRefresh={onRefresh}
      transactions={transactions}
    />
  );
}
