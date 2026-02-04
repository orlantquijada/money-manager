import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

import { BudgetAlerts } from "@/components/dashboard/budget-alerts";
import { ActivityTransactionList } from "@/components/transactions";
import { StyledLeanText, StyledLeanView } from "@/config/interop";
import { trpc } from "@/utils/api";

export default function TransactionsScreen() {
  const queryClient = useQueryClient();

  const {
    data: transactions = [],
    isLoading,
    isFetching,
  } = useQuery(trpc.transaction.allLast7Days.queryOptions());

  const { data: alerts = [] } = useQuery(trpc.budget.alerts.queryOptions());

  const handleRefresh = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: trpc.transaction.allLast7Days.queryKey(),
    });
    queryClient.invalidateQueries({
      queryKey: trpc.budget.alerts.queryKey(),
    });
  }, [queryClient]);

  if (isLoading) {
    return (
      <StyledLeanView className="flex-1 items-center justify-center">
        {/* Could add a skeleton here */}
      </StyledLeanView>
    );
  }

  const hasAlerts = alerts.length > 0;

  return (
    <ActivityTransactionList
      header={
        hasAlerts && (
          <StyledLeanView className="mt-4 gap-4">
            <StyledLeanText className="font-satoshi-bold text-foreground-muted">
              Heads Up
            </StyledLeanText>
            <BudgetAlerts />
          </StyledLeanView>
        )
      }
      isRefreshing={isFetching && !isLoading}
      onRefresh={handleRefresh}
      transactions={transactions}
    />
  );
}
