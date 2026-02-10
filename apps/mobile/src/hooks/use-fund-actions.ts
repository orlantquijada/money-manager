import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { useCallback } from "react";
import { ActionSheetIOS } from "react-native";
import { useAddExpenseStore } from "@/lib/add-expense";
import { trpc } from "@/utils/api";

export function useFundActions(fundId: number) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const markAsPaid = useMutation(
    trpc.transaction.markAsPaid.mutationOptions({
      onSuccess: () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        queryClient.invalidateQueries();
      },
    })
  );

  const archiveMutation = useMutation(
    trpc.fund.update.mutationOptions({
      onSuccess: () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        queryClient.invalidateQueries();
        router.back();
      },
    })
  );

  const deleteMutation = useMutation(
    trpc.fund.delete.mutationOptions({
      onSuccess: () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        queryClient.invalidateQueries();
        router.back();
      },
    })
  );

  const handleAddExpense = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    useAddExpenseStore.getState().setSelectedFundId(fundId);
    router.navigate("/add-expense");
  }, [fundId, router]);

  const handleMarkAsPaid = useCallback(() => {
    markAsPaid.mutate({ fundId });
  }, [fundId, markAsPaid]);

  const handleArchive = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ["Cancel", "Archive Fund"],
        destructiveButtonIndex: 1,
        cancelButtonIndex: 0,
        title: "Archive this fund?",
        message: "You can restore it later from settings.",
      },
      (index) => {
        if (index === 1) {
          archiveMutation.mutate({ id: fundId, enabled: false });
        }
      }
    );
  }, [fundId, archiveMutation]);

  const handleDelete = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ["Cancel", "Delete Fund"],
        destructiveButtonIndex: 1,
        cancelButtonIndex: 0,
        title: "Delete this fund?",
        message:
          "This action cannot be undone. All transactions will be preserved but unlinked.",
      },
      (index) => {
        if (index === 1) {
          deleteMutation.mutate(fundId);
        }
      }
    );
  }, [fundId, deleteMutation]);

  return { handleAddExpense, handleMarkAsPaid, handleArchive, handleDelete };
}
