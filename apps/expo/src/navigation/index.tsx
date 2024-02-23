import { Platform } from "react-native"
import { createStackNavigator } from "@react-navigation/stack"
import { useUser } from "@clerk/clerk-expo"

import { mauveDark, violet } from "~/utils/colors"
import type { RootStackParamList } from "~/types"
import { useOnboarding } from "~/utils/hooks/useOnboarding"

import CreateFund from "~/screens/create-fund"
import CreateFolder from "~/screens/create-folder"
import TransactionsPage from "~/screens/transactions-list"
import Welcome from "~/screens/welcome"
import Onboarding from "~/screens/onboarding"

import RootTabs from "./tabs"

const RootStack = createStackNavigator<RootStackParamList>()

export default function Routes() {
  const { isSignedIn } = useUser()
  const { loaded } = useOnboarding()

  if (!loaded) return null

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
        listeners={({ navigation }) => ({
          focus: () => {
            // if (route.params == null) {
            //   navigation.setParams({})
            //   navigation.navigate("Welcome")
            // }
            if (!isSignedIn) {
              // navigation.setParams({})
              navigation.navigate("Welcome")
            }
          },
        })}
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

      <RootStack.Screen
        name="Onboarding"
        component={Onboarding}
        options={{
          cardStyle: { backgroundColor: mauveDark.mauve1 },
          presentation: Platform.OS === "ios" ? "modal" : "card",
          gestureResponseDistance: 0,
        }}
      />

      <RootStack.Screen
        name="Welcome"
        component={Welcome}
        options={{
          cardStyle: { backgroundColor: mauveDark.mauve1 },
          presentation: Platform.OS === "ios" ? "modal" : "card",

          // WARN: uncomment this
          gestureResponseDistance: 0,
        }}
      />
    </RootStack.Navigator>
  )
}
