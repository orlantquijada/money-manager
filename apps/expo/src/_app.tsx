import "expo-dev-client"

import { useCallback } from "react"
import { StatusBar } from "expo-status-bar"
import { SafeAreaProvider } from "react-native-safe-area-context"
import * as SplashScreen from "expo-splash-screen"
import { TamaguiProvider } from "tamagui"

import { TRPCProvider } from "./utils/trpc"
// import { HomeScreen } from "./screens/home"
import { useFonts } from "./utils/hooks/useFonts"
import Home2 from "./screens/home2"
import config from "../tamagui.config"

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
      <TamaguiProvider config={config}>
        <SafeAreaProvider>
          <Home2 onLayout={onLayoutRootView}>
            <StatusBar style="dark" />
          </Home2>
          {/* <HomeScreen onLayout={onLayoutRootView}> */}
          {/* </HomeScreen> */}
        </SafeAreaProvider>
      </TamaguiProvider>
    </TRPCProvider>
  )
}
