import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";

import { useAddExpenseStore } from "@/lib/add-expense";
import { useRecentFundsStore } from "@/stores/recent-funds";
import { trpc } from "@/utils/api";

/**
 * Low-level mutation hook for creating transactions.
 * Handles success side effects: recent funds, haptics, cache invalidation, store reset, navigation.
 */
export function useCreateTransactionMutation() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const addRecentFund = useRecentFundsStore((s) => s.addRecentFund);

  return useMutation(
    trpc.transaction.create.mutationOptions({
      onSuccess: (_data, variables) => {
        // Track recently used fund
        addRecentFund(variables.fundId);

        // Success haptics
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

        // Invalidate only transaction and fund queries (funds track spent amounts)
        queryClient.invalidateQueries({ queryKey: [["transaction"]] });
        queryClient.invalidateQueries({ queryKey: [["fund"]] });

        // Reset form state
        useAddExpenseStore.getState().reset();

        // Navigate back to dashboard
        router.navigate({ pathname: "/(app)/(tabs)/(dashboard)" });
      },
    })
  );
}

/**
 * Convenience hook combining store state with mutation.
 * Returns a submit function, loading state, and canSubmit flag.
 *
 * @param amount - Current amount from useAmount hook
 * @param resetAmount - Reset callback from useAmount hook
 */
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
          // Reset the amount hook state as well
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
