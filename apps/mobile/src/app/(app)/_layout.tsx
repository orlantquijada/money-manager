import { Stack } from "expo-router";
import type { ComponentProps } from "react";
import { Platform } from "react-native";
import { useThemeColor } from "@/components/theme-provider";

const isIOS = Platform.OS === "ios";

export default function AppLayout() {
  const backgroundColor = useThemeColor("background");
  const backgroundSecondaryColor = useThemeColor("background-secondary");
  const headerTintColor = useThemeColor("foreground-muted");

  const formSheetOptions = {
    presentation: "formSheet",
    headerShown: false,
    sheetAllowedDetents: "fitToContents",
    sheetGrabberVisible: true,
    sheetCornerRadius: 24,
    contentStyle: {
      backgroundColor: isIOS ? "transparent" : backgroundSecondaryColor,
    },
  } satisfies ComponentProps<typeof Stack.Screen>["options"];

  const modalOptions = {
    presentation: isIOS ? "modal" : "card",
    animation: isIOS ? undefined : "slide_from_bottom",
    contentStyle: { backgroundColor },
  } satisfies ComponentProps<typeof Stack.Screen>["options"];

  return (
    <Stack
      initialRouteName="(tabs)"
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor },
        headerTintColor,
      }}
    >
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="create-fund" options={modalOptions} />
      <Stack.Screen name="create-folder" options={modalOptions} />
      <Stack.Screen name="fund/[id]" options={modalOptions} />
      <Stack.Screen
        name="transaction/[id]"
        options={{ ...formSheetOptions, sheetAllowedDetents: [0.4] }}
      />
      <Stack.Screen name="alerts" options={formSheetOptions} />
      <Stack.Screen
        name="settings"
        options={{
          ...modalOptions,
          headerShown: true,
          headerTitle: "",
          headerTransparent: true,
          headerBlurEffect: "none",
        }}
      />
    </Stack>
  );
}
