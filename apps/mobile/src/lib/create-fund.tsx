import { useMutation } from "@tanstack/react-query";
import type { FundType, TimeMode } from "api";
import { useRouter } from "expo-router";
import { createStore } from "zustand";

import { queryClient, trpc } from "@/utils/api";
import { createScopedStore } from "@/utils/create-scoped-store";

export type CreateFundScreens =
  | "fundInfo"
  | "spendingInfo"
  | "nonNegotiableInfo"
  | "chooseFolder";

type CreateFundFormState = {
  name: string;
  fundType: FundType;
  timeMode: TimeMode | null;
  budgetedAmount: number;
  folderId: number | null;
};

type CreateFundFormActions = {
  setName: (name: string) => void;
  setFundType: (fundType: FundType) => void;
  setTimeMode: (timeMode: TimeMode) => void;
  setBudgetedAmount: (amount: number) => void;
  setFolderId: (folderId: number) => void;
  reset: () => void;
};

type CreateFundFormStore = CreateFundFormActions & CreateFundFormState;

const initialFormState: CreateFundFormState = {
  name: "",
  fundType: "SPENDING",
  timeMode: null,
  budgetedAmount: 0,
  folderId: null,
};

export const { Provider: CreateFundProvider, useStore: useCreateFundStore } =
  createScopedStore(() =>
    createStore<CreateFundFormStore>((set) => ({
      ...initialFormState,

      setName: (name) => set({ name }),

      setFundType: (fundType) => set({ ...initialFormState, fundType }),
      setTimeMode: (timeMode) => set({ timeMode }),
      setBudgetedAmount: (budgetedAmount) => set({ budgetedAmount }),
      setFolderId: (folderId) => set({ folderId }),
      reset: () => set(initialFormState),
    }))
  );

export function useCreateFundIsDirty() {
  return useCreateFundStore((state) => {
    return (
      state.name !== initialFormState.name ||
      state.fundType !== initialFormState.fundType ||
      state.timeMode !== initialFormState.timeMode ||
      state.budgetedAmount !== initialFormState.budgetedAmount ||
      state.folderId !== initialFormState.folderId
    );
  });
}

export function useCreateFundMutation() {
  const store = useCreateFundStore();

  return useMutation({
    ...trpc.fund.create.mutationOptions(),
    onSuccess: () => {
      store.getState().reset();
      queryClient.invalidateQueries({ queryKey: [["fund", "list"]] });
    },
  });
}

export function useSubmitFund() {
  const router = useRouter();
  const name = useCreateFundStore((s) => s.name);
  const fundType = useCreateFundStore((s) => s.fundType);
  const timeMode = useCreateFundStore((s) => s.timeMode);
  const budgetedAmount = useCreateFundStore((s) => s.budgetedAmount);

  const mutation = useCreateFundMutation();

  const submit = (folderId: number) => {
    if (!timeMode) {
      return;
    }
    mutation.mutate(
      {
        name,
        fundType,
        timeMode,
        budgetedAmount,
        folderId,
      },
      {
        onSuccess: () => {
          router.replace("/");
        },
      }
    );
  };

  return {
    submit,
    isPending: mutation.isPending,
  };
}

export function getFundTypeContinueBtnLabel(
  presetFolderId: number | null,
  isPending: boolean
): string {
  if (!presetFolderId) {
    return "Continue";
  }
  return isPending ? "Saving..." : "Save";
}

export const FUND_NAME_PLACEHOLDERS = [
  "Morning Coffee",
  "Spotify Premium",
  "Netflix",
  "Grab Rides",
  "Haircut",
  "Phone Bill",
  "Gym Membership",
  "Rent",
  "Electric Bill",
  "Internet Bill",
  "Water Bill",
  "Dog Food",
  "Cat Treats",
  "Lunch at Work",
  "Weekend Brunch",
];

export const FOLDER_NAME_PLACEHOLDERS = [
  "Living Expenses",
  "Subscriptions",
  "Food & Dining",
  "Transportation",
  "Entertainment",
  "Health & Fitness",
  "Personal Care",
  "Savings Goals",
  "Bills & Utilities",
  "Shopping",
  "Travel",
  "Education",
  "Gifts & Donations",
  "Home & Garden",
  "Work Expenses",
];
