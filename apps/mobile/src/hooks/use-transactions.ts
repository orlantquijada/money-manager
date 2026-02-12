import { useInfiniteQuery } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";
import { trpc } from "@/utils/api";

export function useTransactionList(month: Date) {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const year = month.getFullYear();
  const monthNum = month.getMonth() + 1;

  const {
    data,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = useInfiniteQuery(
    trpc.transaction.list.infiniteQueryOptions(
      { year, month: monthNum, limit: 50 },
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
