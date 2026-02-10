import "../global.css";
import "react-native-reanimated";
import "@/config/interop";

import { ClerkLoaded, ClerkProvider, useAuth } from "@clerk/clerk-expo";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { configureReanimatedLogger } from "react-native-reanimated";
import { SafeAreaListener } from "react-native-safe-area-context";
import { Uniwind } from "uniwind";
import { useTheme } from "@/components/theme-provider";
import { env } from "@/env";
import { useAuthTokenSync } from "@/hooks/use-auth-token-sync";
import { useFonts } from "@/hooks/use-fonts";
import { useUserProvisioning } from "@/hooks/use-user-provisioning";
import { tokenCache } from "@/lib/token-cache";
import { queryClient } from "@/utils/api";
import { queryPersister, shouldPersistQuery } from "@/utils/query-persister";
import { asMilliseconds } from "@/utils/time";

if (process.env.NODE_ENV === "development") {
  configureReanimatedLogger({ strict: false });
}

export const unstable_settings = {
  anchor: "(app)",
};

SplashScreen.preventAutoHideAsync();

function AppContent() {
  const { isDark } = useTheme();
  const { isSignedIn } = useAuth();

  const { isTokenReady } = useAuthTokenSync();
  const { isProvisioned } = useUserProvisioning({ isTokenReady });

  const isAuthenticated = !!isSignedIn && isProvisioned;
  const isAuthReady = !isSignedIn || isProvisioned;

  useEffect(() => {
    if (isAuthReady) {
      SplashScreen.hide();
    }
  }, [isAuthReady]);

  return (
    <>
      <Stack>
        <Stack.Protected guard={isAuthenticated}>
          <Stack.Screen name="(app)" options={{ headerShown: false }} />
        </Stack.Protected>

        <Stack.Protected guard={!isAuthenticated}>
          <Stack.Screen name="sign-in" options={{ headerShown: false }} />
        </Stack.Protected>

        <Stack.Screen
          name="modal"
          options={{ presentation: "modal", title: "Modal" }}
        />
      </Stack>
      <StatusBar style={isDark ? "light" : "dark"} />
    </>
  );
}

export default function RootLayout() {
  const loaded = useFonts();

  if (!loaded) {
    return null;
  }

  return (
    <ClerkProvider
      publishableKey={env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY}
      tokenCache={tokenCache}
    >
      <ClerkLoaded>
        <SafeAreaListener
          onChange={({ insets }) => {
            Uniwind.updateInsets(insets);
          }}
        >
          <PersistQueryClientProvider
            client={queryClient}
            onSuccess={() => {
              if (process.env.NODE_ENV === "development") {
                console.log("[Cache] Hydrated from MMKV");
              }
            }}
            persistOptions={{
              persister: queryPersister,
              maxAge: asMilliseconds({ minutes: 24 * 60 }),
              dehydrateOptions: {
                shouldDehydrateQuery: shouldPersistQuery,
              },
            }}
          >
            <KeyboardProvider>
              <GestureHandlerRootView style={{ flex: 1 }}>
                <BottomSheetModalProvider>
                  <AppContent />
                </BottomSheetModalProvider>
              </GestureHandlerRootView>
            </KeyboardProvider>
          </PersistQueryClientProvider>
        </SafeAreaListener>
      </ClerkLoaded>
    </ClerkProvider>
  );
}
