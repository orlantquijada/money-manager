import { useCallback } from "react"
import { StatusBar } from "expo-status-bar"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { NavigationContainer } from "@react-navigation/native"
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import * as SplashScreen from "expo-splash-screen"

import { violet } from "~/utils/colors"

import Routes from "./navigation"
import { TRPCProvider } from "./utils/trpc"
import { useFonts } from "./utils/hooks/useFonts"

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync().catch(() => {
  return
})

export const App = () => {
  const fontsLoaded = useFonts()
  const onLayoutRootView = useCallback(() => {
    if (fontsLoaded)
      SplashScreen.hideAsync().catch(() => {
        return
      })
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
            <BottomSheetModalProvider>
              <Routes />
              <StatusBar style="dark" />
            </BottomSheetModalProvider>
          </SafeAreaProvider>
        </NavigationContainer>
      </GestureHandlerRootView>
    </TRPCProvider>
  )
}
