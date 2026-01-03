import * as Haptics from "expo-haptics";
import { useEffect } from "react";
import { usePrevious } from "@/hooks/use-previous";

export function useTabChangeHaptics(index: number) {
  const previousIndex = usePrevious(index);

  useEffect(() => {
    if (previousIndex !== undefined && previousIndex !== index) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  }, [previousIndex, index]);
}
