import "../global.css";
import "react-native-reanimated";
import "@/config/interop";

import { ClerkLoaded, ClerkProvider, useAuth } from "@clerk/clerk-expo";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { QueryClientProvider } from "@tanstack/react-query";
import { type Href, Redirect, Stack, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { configureReanimatedLogger } from "react-native-reanimated";
import { SafeAreaListener } from "react-native-safe-area-context";
import { Uniwind } from "uniwind";

import { ThemeProvider, useTheme } from "@/components/theme-provider";
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
  const segments = useSegments();

  // Sync Clerk token to tRPC client
  const { isTokenReady } = useAuthTokenSync();

  // Ensure user exists in database on sign-in (waits for token to be ready)
  const { isProvisioned } = useUserProvisioning({ isTokenReady });

  // Check if we're on a protected route
  const inAuthGroup = segments[0] === "(app)";

  // Redirect based on auth state
  if (!isSignedIn && inAuthGroup) {
    return <Redirect href={"/sign-in" as Href} />;
  }

  // Block rendering protected routes until user is provisioned in the database
  // This prevents race conditions where queries fire before the user row exists
  if (isSignedIn && inAuthGroup && !isProvisioned) {
    return null;
  }

  if (isSignedIn && (segments[0] as string) === "sign-in") {
    return <Redirect href="/(app)/(tabs)/(dashboard)" />;
  }

  return (
    <>
      <Stack>
        <Stack.Screen name="(app)" options={{ headerShown: false }} />
        <Stack.Screen name="sign-in" options={{ headerShown: false }} />
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
                <ThemeProvider>
                  <BottomSheetModalProvider>
                    <AppContent />
                  </BottomSheetModalProvider>
                </ThemeProvider>
              </GestureHandlerRootView>
            </KeyboardProvider>
          </QueryClientProvider>
        </SafeAreaListener>
      </ClerkLoaded>
    </ClerkProvider>
  );
}
