import { RouteProp, useRoute } from "@react-navigation/native"

import type { HomeTabsParamList } from "~/types"

export function useHomeTabRoute<T extends keyof HomeTabsParamList>(route: T) {
  return useRoute<RouteProp<HomeTabsParamList, typeof route>>()
}
