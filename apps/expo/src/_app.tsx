import "../global.css";

import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { useCallback } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { violet } from "~/utils/colors";

import Routes from "./navigation";
import { useFonts } from "./utils/hooks/useFonts";
import { TRPCProvider } from "./utils/trpc";

// Keep the splash screen visible while we fetch resources
// SplashScreen.preventAutoHideAsync().catch(() => {
//   return;
// });

// TODO: quick actions for android

export const App = () => {
  const fontsLoaded = useFonts();
  const onLayoutRootView = useCallback(() => {
    if (fontsLoaded) {
      // SplashScreen.hideAsync().catch(() => {
      //   return
      // })
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <TRPCProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <NavigationContainer>
          <SafeAreaProvider
            onLayout={onLayoutRootView}
            style={{ backgroundColor: violet.violet1 }}
          >
            <BottomSheetModalProvider>
              <Content />
            </BottomSheetModalProvider>
          </SafeAreaProvider>
        </NavigationContainer>
      </GestureHandlerRootView>
    </TRPCProvider>
  );
};

function Content() {
  // const loadedCreds = useInitializeCreds();
  // const loaded = useInitializeUser(!loadedCreds);
  // console.log({ loaded });

  // if (!loaded) {
  //   return null;
  // }

  return (
    <>
      <Routes />
      <StatusBar style="dark" />
    </>
  );
}
