import { createStackNavigator } from "@react-navigation/stack"

import { mauveDark, violet } from "~/utils/colors"
import type { RootStackParamList } from "~/types"

import CreateFund from "~/screens/create-fund"
import CreateFolder from "~/screens/create-folder"

import RootTabs from "./tabs"
import { Platform } from "react-native"
import TransactionsPage from "~/screens/transactions-list"
import { ClerkLoaded, useUser } from "@clerk/clerk-expo"
import Welcome from "~/screens/welcome"

const RootStack = createStackNavigator<RootStackParamList>()

export default function Routes() {
  const { isSignedIn } = useUser()

  return (
    <ClerkLoaded>
      <RootStack.Navigator
        initialRouteName="Root"
        screenOptions={{ headerShown: false }}
        detachInactiveScreens
        screenListeners={({ navigation, route }) => ({
          focus: () => {
            console.log(route.params)
            if (route.params === undefined && !isSignedIn) {
              navigation.setParams({ text: "hello" })
              navigation.navigate("Welcome")
            }
          },
        })}
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
          name="Welcome"
          component={Welcome}
          options={{
            cardStyle: { backgroundColor: mauveDark.mauve1 },
            presentation: Platform.OS === "ios" ? "modal" : "card",
            // gestureResponseDistance: 0,
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
    </ClerkLoaded>
  )
}
