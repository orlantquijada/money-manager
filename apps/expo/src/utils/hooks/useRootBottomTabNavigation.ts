import { useNavigation } from "@react-navigation/native"
import { MaterialTopTabNavigationProp } from "@react-navigation/material-top-tabs"

import type { RootBottomTabParamList } from "~/types"

export function useRootBottomTabNavigation() {
  return useNavigation<MaterialTopTabNavigationProp<RootBottomTabParamList>>()
}
