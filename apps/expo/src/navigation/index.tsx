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
import { useInitializeUser } from "~/utils/hooks/useInitializeUser"
import { useOnboarding } from "~/utils/hooks/useOnboarding"
import Onboarding from "~/screens/onboarding"

const RootStack = createStackNavigator<RootStackParamList>()

export default function Routes() {
  const { isSignedIn } = useUser()
  // useInitializeUser()
  const { didFirstLaunch, loaded, handleSetFirstLaunch } = useOnboarding()

  console.log({ didFirstLaunch })

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
        listeners={({ navigation, route }) => ({
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
