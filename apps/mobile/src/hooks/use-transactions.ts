import { useInfiniteQuery } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";
import { trpc } from "@/utils/api";

/**
 * Hook for paginated transaction list with month filtering.
 * Handles caching per year/month - switching back to a cached month shows data instantly.
 */
export function useTransactionList(year: number, month: number) {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const {
    data,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = useInfiniteQuery(
    trpc.transaction.list.infiniteQueryOptions(
      { year, month, limit: 50 },
      { getNextPageParam: (lastPage) => lastPage.nextCursor }
    )
  );

  const transactions = useMemo(
    () => data?.pages.flatMap((page) => page.transactions) ?? [],
    [data?.pages]
  );

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  }, [refetch]);

  // Loading first page of an uncached period
  const isLoading = isFetching && !isFetchingNextPage && !data;

  return {
    transactions,
    isLoading,
    isFetchingNextPage,
    hasNextPage: !!hasNextPage,
    fetchNextPage: handleLoadMore,
    refetch: handleRefresh,
    isRefreshing,
  };
}

/**
 * Hook for paginated transactions by fund.
 * Caches per fundId.
 */
export function useFundTransactions(fundId: number) {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const {
    data,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = useInfiniteQuery(
    trpc.transaction.listByFund.infiniteQueryOptions(
      { fundId, limit: 50 },
      { getNextPageParam: (lastPage) => lastPage.nextCursor }
    )
  );

  const transactions = useMemo(
    () => data?.pages.flatMap((page) => page.transactions) ?? [],
    [data?.pages]
  );

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  }, [refetch]);

  const isLoading = isFetching && !isFetchingNextPage && !data;

  return {
    transactions,
    isLoading,
    isFetchingNextPage,
    hasNextPage: !!hasNextPage,
    fetchNextPage: handleLoadMore,
    refetch: handleRefresh,
    isRefreshing,
  };
}
