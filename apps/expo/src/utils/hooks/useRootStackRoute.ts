import { type RouteProp, useRoute } from "@react-navigation/native";

import type { RootStackParamList } from "~/types";

export function useRootStackRoute<T extends keyof RootStackParamList>(
  _route: T
) {
  return useRoute<RouteProp<RootStackParamList, typeof route>>();
}
