import type { StorePick } from "api";
import { create } from "zustand";

// State shape
type AddExpenseState = {
  date: Date;
  selectedFundId: number | null;
  selectedStore: StorePick | null;
  note: string;
};

// Actions
type AddExpenseActions = {
  setDate: (date: Date) => void;
  setSelectedFundId: (fundId: number | null) => void;
  setSelectedStore: (store: StorePick | null) => void;
  setNote: (note: string) => void;
  /** Combined setter: selects store and auto-fills fund if store has lastSelectedFundId */
  selectStoreWithFundDefault: (store: StorePick) => void;
  reset: () => void;
};

type AddExpenseStore = AddExpenseState & AddExpenseActions;

const getInitialState = (): AddExpenseState => ({
  date: new Date(),
  selectedFundId: null,
  selectedStore: null,
  note: "",
});

export const useAddExpenseStore = create<AddExpenseStore>((set, get) => ({
  ...getInitialState(),

  setDate: (date) => set({ date }),
  setSelectedFundId: (selectedFundId) => set({ selectedFundId }),
  setSelectedStore: (selectedStore) => set({ selectedStore }),
  setNote: (note) => set({ note }),

  selectStoreWithFundDefault: (store) => {
    const { selectedFundId } = get();
    set({
      selectedStore: store,
      // Auto-fill fund only if store has lastSelectedFundId and no fund is currently selected
      selectedFundId:
        store.lastSelectedFundId && !selectedFundId
          ? store.lastSelectedFundId
          : selectedFundId,
    });
  },

  reset: () => set({ ...getInitialState(), date: new Date() }),
}));

/**
 * Selector for checking if form can be submitted.
 * Amount comes from useAmount hook, passed as parameter.
 */
export function useCanSubmit(amount: number) {
  const selectedFundId = useAddExpenseStore((s) => s.selectedFundId);
  return selectedFundId !== null && amount > 0;
}
