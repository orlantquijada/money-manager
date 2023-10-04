import "react-native-reanimated"
import "react-native-gesture-handler"

import { useCallback } from "react"
import { StatusBar } from "expo-status-bar"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { NavigationContainer } from "@react-navigation/native"
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import * as SplashScreen from "expo-splash-screen"
import { ClerkProvider } from "@clerk/clerk-expo"

import { violet } from "~/utils/colors"

import Routes from "./navigation"
import { TRPCProvider } from "./utils/trpc"
import { useFonts } from "./utils/hooks/useFonts"
import { tokenCache } from "./utils/tokenCache"

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync().catch(() => {
  return
})

// TODO: quick actions for android

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
    <ClerkProvider
      publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY || ""}
      tokenCache={tokenCache}
    >
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
    </ClerkProvider>
  )
}
