import { useQuery } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import { GlassIconButton } from "@/components/glass-button";
import { TransactionList } from "@/components/transactions";
import { StyledLeanText, StyledLeanView } from "@/config/interop";
import { useFundTransactions } from "@/hooks/use-transactions";
import { trpc } from "@/utils/api";

export default function FundTransactionsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const fundId = Number(id);

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

  if (fundLoading) {
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
    <StyledLeanView className="flex-1 bg-background pt-safe">
      {/* Header */}
      <StyledLeanView className="flex-row items-center justify-between px-4 pb-4">
        <GlassIconButton
          icon="chevron.left"
          onPress={() => router.back()}
          size="lg"
        />
        <StyledLeanText
          className="flex-1 text-center font-satoshi-medium text-foreground text-lg"
          ellipsizeMode="tail"
          numberOfLines={1}
        >
          {fund.name}
        </StyledLeanText>
        <StyledLeanView className="w-12" />
      </StyledLeanView>

      {/* Transaction List */}
      <StyledLeanView className="flex-1" style={{ marginHorizontal: -16 }}>
        <TransactionList
          emptyStateVariant="period-empty"
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          isRefreshing={isRefreshing}
          onLoadMore={fetchNextPage}
          onRefresh={refetch}
          transactions={transactions}
        />
      </StyledLeanView>
    </StyledLeanView>
  );
}
