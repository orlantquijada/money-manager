import "../global.css";
import "react-native-reanimated";
import "@/config/interop";

import { ClerkLoaded, ClerkProvider, useAuth } from "@clerk/clerk-expo";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { QueryClientProvider } from "@tanstack/react-query";
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
import { useAuthTokenSync } from "@/hooks/use-auth-token-sync";
import { useFonts } from "@/hooks/use-fonts";
import { useUserProvisioning } from "@/hooks/use-user-provisioning";
import { tokenCache } from "@/lib/token-cache";
import { queryClient } from "@/utils/api";

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

if (!publishableKey) {
  throw new Error("Missing EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY");
}

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

  // Sync Clerk token to tRPC client
  const { isTokenReady } = useAuthTokenSync();

  // Ensure user exists in database on sign-in (waits for token to be ready)
  const { isProvisioned } = useUserProvisioning({ isTokenReady });

  // Full authentication guard: signed in AND provisioned in DB
  // User stays on sign-in screen during provisioning phase
  const isAuthenticated = !!isSignedIn && isProvisioned;

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

  useEffect(() => {
    if (loaded) {
      SplashScreen.hide();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <ClerkLoaded>
        <SafeAreaListener
          onChange={({ insets }) => {
            Uniwind.updateInsets(insets);
          }}
        >
          <QueryClientProvider client={queryClient}>
            <KeyboardProvider>
              <GestureHandlerRootView style={{ flex: 1 }}>
                <BottomSheetModalProvider>
                  <AppContent />
                </BottomSheetModalProvider>
              </GestureHandlerRootView>
            </KeyboardProvider>
          </QueryClientProvider>
        </SafeAreaListener>
      </ClerkLoaded>
    </ClerkProvider>
  );
}
