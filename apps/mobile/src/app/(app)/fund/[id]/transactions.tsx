import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { GlassCloseButton } from "@/components/glass-button";
import {
  type TransactionItem,
  TransactionList,
} from "@/components/transactions";
import { StyledLeanText, StyledLeanView } from "@/config/interop";
import { trpc } from "@/utils/api";

export default function FundTransactionsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const fundId = Number(id);
  const queryClient = useQueryClient();

  // Pagination state
  const [cursor, setCursor] = useState<string | undefined>();
  const [transactions, setTransactions] = useState<TransactionItem[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Query fund for header
  const { data: fund, isLoading: fundLoading } = useQuery(
    trpc.fund.retrieve.queryOptions(fundId)
  );

  // Query list with pagination
  const { data: listData, isFetching: listFetching } = useQuery(
    trpc.transaction.listByFund.queryOptions({ fundId, cursor, limit: 50 })
  );

  // Accumulate transactions when data changes
  useEffect(() => {
    if (listData?.transactions) {
      setTransactions((prev) =>
        cursor ? [...prev, ...listData.transactions] : listData.transactions
      );
    }
  }, [listData?.transactions, cursor]);

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
        <GlassCloseButton />
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
          hasNextPage={!!listData?.nextCursor}
          isFetchingNextPage={listFetching && !!cursor}
          isRefreshing={isRefreshing}
          onLoadMore={handleLoadMore}
          onRefresh={handleRefresh}
          transactions={transactions}
        />
      </StyledLeanView>
    </StyledLeanView>
  );
}
