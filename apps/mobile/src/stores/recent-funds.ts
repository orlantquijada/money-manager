import { createMMKV } from "react-native-mmkv";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const storage = createMMKV({ id: "recent-funds" });

const mmkvStorage = {
  getItem: (name: string) => storage.getString(name) ?? null,
  setItem: (name: string, value: string) => storage.set(name, value),
  removeItem: (name: string) => storage.remove(name),
};

type RecentFundsState = {
  recentFundIds: number[];
  addRecentFund: (fundId: number) => void;
};

const MAX_RECENT_FUNDS = 5;

export const useRecentFundsStore = create<RecentFundsState>()(
  persist(
    (set) => ({
      recentFundIds: [],
      addRecentFund: (fundId: number) =>
        set((state) => {
          const filtered = state.recentFundIds.filter((id) => id !== fundId);
          return {
            recentFundIds: [fundId, ...filtered].slice(0, MAX_RECENT_FUNDS),
          };
        }),
    }),
    {
      name: "recent-funds-storage",
      storage: createJSONStorage(() => mmkvStorage),
    }
  )
);
