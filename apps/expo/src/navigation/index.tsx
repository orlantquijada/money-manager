import { useUser } from "@clerk/clerk-expo";
import { createStackNavigator } from "@react-navigation/stack";
import { Platform } from "react-native";
import CreateFolder from "~/screens/create-folder";
import CreateFund from "~/screens/create-fund";
import Onboarding from "~/screens/onboarding";
import TransactionsPage from "~/screens/transactions-list";
import Welcome from "~/screens/welcome";
import type { RootStackParamList } from "~/types";
import { mauveDark, violet } from "~/utils/colors";
import { useOnboarding } from "~/utils/hooks/useOnboarding";

import RootTabs from "./tabs";

const RootStack = createStackNavigator<RootStackParamList>();

export default function Routes() {
  const { isSignedIn } = useUser();
  const { loaded } = useOnboarding();

  if (!loaded) {
    return null;
  }

  return (
    <RootStack.Navigator
      detachInactiveScreens
      initialRouteName="Root"
      screenOptions={{ headerShown: false }}
    >
      <RootStack.Screen
        component={RootTabs}
        listeners={({ navigation }) => ({
          focus: () => {
            // if (route.params == null) {
            //   navigation.setParams({})
            //   navigation.navigate("Welcome")
            // }
            if (!isSignedIn) {
              // navigation.setParams({})
              navigation.navigate("Welcome");
            }
          },
        })}
        name="Root"
        options={{ cardStyle: { backgroundColor: violet.violet1 } }}
      />
      <RootStack.Screen
        component={CreateFund}
        name="CreateFund"
        options={{
          cardStyle: { backgroundColor: mauveDark.mauve1 },
          presentation: Platform.OS === "ios" ? "modal" : "card",
        }}
      />
      <RootStack.Screen
        component={TransactionsPage}
        name="TransactionsList"
        options={{
          cardStyle: { backgroundColor: mauveDark.mauve1 },
          presentation: Platform.OS === "ios" ? "modal" : "card",
        }}
      />
      <RootStack.Screen
        component={CreateFolder}
        name="CreateFolder"
        options={{
          cardStyle: { backgroundColor: mauveDark.mauve1 },
          presentation: Platform.OS === "ios" ? "modal" : "card",
        }}
      />

      <RootStack.Screen
        component={Onboarding}
        name="Onboarding"
        options={{
          cardStyle: { backgroundColor: mauveDark.mauve1 },
          presentation: Platform.OS === "ios" ? "modal" : "card",
          gestureResponseDistance: 0,
        }}
      />

      <RootStack.Screen
        component={Welcome}
        name="Welcome"
        options={{
          cardStyle: { backgroundColor: mauveDark.mauve1 },
          presentation: Platform.OS === "ios" ? "modal" : "card",

          // WARN: uncomment this
          gestureResponseDistance: 0,
        }}
      />
    </RootStack.Navigator>
  );
}
