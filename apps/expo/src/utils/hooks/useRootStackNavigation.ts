import { useNavigation } from "@react-navigation/native"
import { StackNavigationProp } from "@react-navigation/stack"

import type { RootStackParamList } from "~/types"

export function useRootStackNavigation() {
  return useNavigation<StackNavigationProp<RootStackParamList>>()
}
