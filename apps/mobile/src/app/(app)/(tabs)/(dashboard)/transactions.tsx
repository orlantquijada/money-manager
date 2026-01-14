import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

import { BudgetAlerts } from "@/components/dashboard/budget-alerts";
import { TransactionList } from "@/components/transactions";
import { StyledLeanView } from "@/config/interop";
import { trpc } from "@/utils/api";

export default function TransactionsScreen() {
  const queryClient = useQueryClient();

  const {
    data: transactions = [],
    isLoading,
    isFetching,
  } = useQuery(trpc.transaction.allThisMonth.queryOptions());

  const handleRefresh = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: trpc.transaction.allThisMonth.queryKey(),
    });
  }, [queryClient]);

  if (isLoading) {
    return (
      <StyledLeanView className="flex-1 items-center justify-center">
        {/* Could add a skeleton here */}
      </StyledLeanView>
    );
  }

  return (
    <StyledLeanView className="flex-1">
      <BudgetAlerts />
      <TransactionList
        isRefreshing={isFetching && !isLoading}
        onRefresh={handleRefresh}
        transactions={transactions}
      />
    </StyledLeanView>
  );
}
