import "expo-dev-client"

import { useCallback } from "react"
import { StatusBar } from "expo-status-bar"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { NavigationContainer } from "@react-navigation/native"
import * as SplashScreen from "expo-splash-screen"

import { TRPCProvider } from "./utils/trpc"
// import { HomeScreen } from "./screens/home"
import { useFonts } from "./utils/hooks/useFonts"
// import Home2 from "./screens/home2"
import RootTabs from "./navigation/tabs"
import { violet } from "~/utils/colors"
import { GestureHandlerRootView } from "react-native-gesture-handler"

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync()

export const App = () => {
  const fontsLoaded = useFonts()
  const onLayoutRootView = useCallback(() => {
    if (fontsLoaded) SplashScreen.hideAsync()
  }, [fontsLoaded])

  if (!fontsLoaded) return null

  return (
    <TRPCProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <NavigationContainer>
          <SafeAreaProvider
            onLayout={onLayoutRootView}
            style={{ backgroundColor: violet.violet1 }}
          >
            <RootTabs />
            <StatusBar style="dark" />
          </SafeAreaProvider>
        </NavigationContainer>
      </GestureHandlerRootView>
    </TRPCProvider>
  )
}
