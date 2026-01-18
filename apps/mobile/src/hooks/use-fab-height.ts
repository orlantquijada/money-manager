import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FAB_SIZE } from "@/components/fab-overlay";

export function useFabHeight() {
  const insets = useSafeAreaInsets();
  return FAB_SIZE + insets.bottom;
}
