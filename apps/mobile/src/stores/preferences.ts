import { createMMKV } from "react-native-mmkv";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const storage = createMMKV({ id: "preferences" });

const mmkvStorage = {
  getItem: (name: string) => storage.getString(name) ?? null,
  setItem: (name: string, value: string) => storage.set(name, value),
  removeItem: (name: string) => storage.remove(name),
};

type PreferencesState = {
  aiInsightsEnabled: boolean;
  setAiInsightsEnabled: (enabled: boolean) => void;
};

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      aiInsightsEnabled: false,
      setAiInsightsEnabled: (enabled: boolean) =>
        set({ aiInsightsEnabled: enabled }),
    }),
    {
      name: "preferences-storage",
      storage: createJSONStorage(() => mmkvStorage),
    }
  )
);
