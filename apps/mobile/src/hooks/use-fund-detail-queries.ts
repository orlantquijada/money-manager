import { useQuery } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { trpc } from "@/utils/api";

export function useFundDetailQueries(fundId: number) {
  const {
    data: fund,
    isLoading: fundLoading,
    refetch: refetchFund,
  } = useQuery(trpc.fund.retrieve.queryOptions(fundId));

  const {
    data: transactions,
    isLoading: txLoading,
    refetch: refetchTx,
  } = useQuery(trpc.transaction.recentByFund.queryOptions(fundId));

  const { data: topStores = [] } = useQuery(
    trpc.fund.topStores.queryOptions({ fundId, limit: 3 })
  );

  const { data: storeCount = 0 } = useQuery(
    trpc.fund.storeCount.queryOptions(fundId)
  );

  const { data: periodComparison } = useQuery(
    trpc.fund.periodComparison.queryOptions(fundId)
  );

  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await Promise.all([refetchFund(), refetchTx()]);
    setIsRefreshing(false);
  }, [refetchFund, refetchTx]);

  const isLoading = fundLoading || txLoading;

  return {
    fund,
    transactions,
    topStores,
    storeCount,
    periodComparison,
    isLoading,
    isRefreshing,
    handleRefresh,
  };
}
