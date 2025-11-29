import type { MaterialTopTabNavigationProp } from "@react-navigation/material-top-tabs";
import {
  type CompositeNavigationProp,
  useNavigation,
} from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";

import type { RootBottomTabParamList, RootStackParamList } from "~/types";

export function useRootBottomTabNavigation() {
  return useNavigation<
    CompositeNavigationProp<
      MaterialTopTabNavigationProp<RootBottomTabParamList>,
      StackNavigationProp<RootStackParamList>
    >
  >();
}
