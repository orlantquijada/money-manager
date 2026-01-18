import { useSafeAreaInsets } from "react-native-safe-area-context";

export const FAB_SIZE = 64;

export function useFabHeight() {
  const insets = useSafeAreaInsets();
  return FAB_SIZE + insets.bottom;
}
