import { useNavigation } from "@react-navigation/native"
import { MaterialTopTabNavigationProp } from "@react-navigation/material-top-tabs"

import type { HomeTabsParamList } from "~/types"

export function useHomeTabNavigation() {
  return useNavigation<MaterialTopTabNavigationProp<HomeTabsParamList>>()
}
