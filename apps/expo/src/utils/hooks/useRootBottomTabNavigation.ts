import {
  CompositeNavigationProp,
  useNavigation,
} from "@react-navigation/native"
import { MaterialTopTabNavigationProp } from "@react-navigation/material-top-tabs"
import { StackNavigationProp } from "@react-navigation/stack"

import type { RootBottomTabParamList, RootStackParamList } from "~/types"

export function useRootBottomTabNavigation() {
  return useNavigation<
    CompositeNavigationProp<
      MaterialTopTabNavigationProp<RootBottomTabParamList>,
      StackNavigationProp<RootStackParamList>
    >
  >()
}
