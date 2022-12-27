import "expo-dev-client"

import { StatusBar } from "expo-status-bar"
import { SafeAreaProvider } from "react-native-safe-area-context"
import * as SplashScreen from "expo-splash-screen"

import { TRPCProvider } from "./utils/trpc"
import { HomeScreen } from "./screens/home"
import { useCallback } from "react"
import { useFonts } from "./utils/useFonts"

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
      <SafeAreaProvider>
        <HomeScreen onLayout={onLayoutRootView} />
        <StatusBar />
      </SafeAreaProvider>
    </TRPCProvider>
  )
}
