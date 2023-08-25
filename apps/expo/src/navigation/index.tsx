import { createStackNavigator } from "@react-navigation/stack"

import { mauveDark, violet } from "~/utils/colors"
import type { RootStackParamList } from "~/types"

import CreateFund from "~/screens/create-fund"
import CreateFolder from "~/screens/create-folder"

import RootTabs from "./tabs"
import { Platform } from "react-native"
import TransactionsPage from "~/screens/transactions-list"

const RootStack = createStackNavigator<RootStackParamList>()

export default function Routes() {
  return (
    <RootStack.Navigator
      initialRouteName="Root"
      screenOptions={{ headerShown: false }}
      detachInactiveScreens
    >
      <RootStack.Screen
        name="Root"
        component={RootTabs}
        options={{ cardStyle: { backgroundColor: violet.violet1 } }}
      />
      <RootStack.Screen
        name="CreateFund"
        component={CreateFund}
        options={{
          cardStyle: { backgroundColor: mauveDark.mauve1 },
          presentation: Platform.OS === "ios" ? "modal" : "card",
        }}
      />
      <RootStack.Screen
        name="TransactionsList"
        component={TransactionsPage}
        options={{
          cardStyle: { backgroundColor: mauveDark.mauve1 },
          presentation: Platform.OS === "ios" ? "modal" : "card",
        }}
      />
      <RootStack.Screen
        name="CreateFolder"
        component={CreateFolder}
        options={{
          cardStyle: { backgroundColor: mauveDark.mauve1 },
          presentation: Platform.OS === "ios" ? "modal" : "card",
        }}
      />
    </RootStack.Navigator>
  )
}
