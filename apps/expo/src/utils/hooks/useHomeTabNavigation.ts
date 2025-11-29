import type { MaterialTopTabNavigationProp } from "@react-navigation/material-top-tabs";
import { useNavigation } from "@react-navigation/native";

import type { HomeTabsParamList } from "~/types";

export function useHomeTabNavigation() {
  return useNavigation<MaterialTopTabNavigationProp<HomeTabsParamList>>();
}
