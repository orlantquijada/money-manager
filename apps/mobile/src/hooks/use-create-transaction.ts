import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";

import { useAddExpenseStore } from "@/lib/add-expense";
import { useRecentFundsStore } from "@/stores/recent-funds";
import { trpc } from "@/utils/api";

export function useCreateTransactionMutation() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const addRecentFund = useRecentFundsStore((s) => s.addRecentFund);

  return useMutation(
    trpc.transaction.create.mutationOptions({
      onSuccess: (_data, variables) => {
        addRecentFund(variables.fundId);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

        queryClient.invalidateQueries(trpc.transaction.pathFilter());
        queryClient.invalidateQueries(trpc.fund.pathFilter());
        queryClient.invalidateQueries(trpc.folder.pathFilter());
        queryClient.invalidateQueries(trpc.budget.pathFilter());
        queryClient.invalidateQueries(trpc.store.pathFilter());

        useAddExpenseStore.getState().reset();
        router.navigate({
          pathname: "/(app)/(tabs)/(main)/(home)/(dashboard)",
        });
      },
    })
  );
}

export function useSubmitTransaction(amount: number, resetAmount: () => void) {
  const date = useAddExpenseStore((s) => s.date);
  const selectedFundId = useAddExpenseStore((s) => s.selectedFundId);
  const selectedStore = useAddExpenseStore((s) => s.selectedStore);
  const note = useAddExpenseStore((s) => s.note);

  const mutation = useCreateTransactionMutation();

  const submit = () => {
    if (selectedFundId === null || amount <= 0) return;

    mutation.mutate(
      {
        fundId: selectedFundId,
        amount,
        date: date.toISOString(),
        note: note.trim() || undefined,
        store: selectedStore?.name ?? "",
      },
      {
        onSuccess: () => {
          resetAmount();
        },
      }
    );
  };

  return {
    submit,
    isPending: mutation.isPending,
    canSubmit: selectedFundId !== null && amount > 0,
  };
}
