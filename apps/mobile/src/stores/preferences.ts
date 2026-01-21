import { createMMKV } from "react-native-mmkv";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const storage = createMMKV({ id: "preferences" });

const mmkvStorage = {
  getItem: (name: string) => storage.getString(name) ?? null,
  setItem: (name: string, value: string) => storage.set(name, value),
  removeItem: (name: string) => storage.remove(name),
};

type Theme = "light" | "dark" | "system";
type FundType = "SPENDING" | "NON_NEGOTIABLE";
type TimeMode = "WEEKLY" | "MONTHLY" | "BIMONTHLY" | "EVENTUALLY";

type PreferencesState = {
  // AI Features
  aiInsightsEnabled: boolean;
  setAiInsightsEnabled: (enabled: boolean) => void;

  // Appearance
  theme: Theme;
  setTheme: (theme: Theme) => void;

  // Fund defaults
  defaultFundType: FundType;
  setDefaultFundType: (fundType: FundType) => void;

  defaultTimeMode: TimeMode;
  setDefaultTimeMode: (timeMode: TimeMode) => void;

  // Alerts
  alertThreshold: number;
  setAlertThreshold: (threshold: number) => void;
};

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      // AI Features
      aiInsightsEnabled: false,
      setAiInsightsEnabled: (enabled: boolean) =>
        set({ aiInsightsEnabled: enabled }),

      // Appearance
      theme: "system",
      setTheme: (theme: Theme) => set({ theme }),

      // Fund defaults
      defaultFundType: "SPENDING",
      setDefaultFundType: (fundType: FundType) =>
        set({ defaultFundType: fundType }),

      defaultTimeMode: "MONTHLY",
      setDefaultTimeMode: (timeMode: TimeMode) =>
        set({ defaultTimeMode: timeMode }),

      // Alerts
      alertThreshold: 90,
      setAlertThreshold: (threshold: number) =>
        set({ alertThreshold: threshold }),
    }),
    {
      name: "preferences-storage",
      storage: createJSONStorage(() => mmkvStorage),
    }
  )
);
