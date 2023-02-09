import { RouteProp, useRoute } from "@react-navigation/native"

import type { RootBottomTabParamList } from "~/types"

export function useRootBottomTabRoute<T extends keyof RootBottomTabParamList>(
  route: T,
) {
  return useRoute<RouteProp<RootBottomTabParamList, typeof route>>()
}
