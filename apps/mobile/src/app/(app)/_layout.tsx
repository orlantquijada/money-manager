import { Stack } from "expo-router";
import type { ComponentProps } from "react";
import { useThemeColor } from "@/components/theme-provider";

const modalHeaderOptions = {
  presentation: "modal",
} satisfies ComponentProps<typeof Stack.Screen>["options"];

const formSheetOptions = {
  presentation: "formSheet",
  headerShown: false,
  // sheetAllowedDetents: [0.5, 1],
  sheetAllowedDetents: [0.4],
  sheetGrabberVisible: true,
  sheetCornerRadius: 24,
  contentStyle: {
    backgroundColor: "transparent",
  },
} satisfies ComponentProps<typeof Stack.Screen>["options"];

export default function AppLayout() {
  const backgroundColor = useThemeColor("background");

  return (
    <Stack
      initialRouteName="(tabs)"
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor },
      }}
    >
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="create-fund" options={modalHeaderOptions} />
      <Stack.Screen name="create-folder" options={modalHeaderOptions} />
      <Stack.Screen name="fund/[id]" options={modalHeaderOptions} />
      <Stack.Screen name="transaction/[id]" options={formSheetOptions} />
      <Stack.Screen
        name="alerts"
        options={{ ...formSheetOptions, sheetAllowedDetents: "fitToContents" }}
      />
      <Stack.Screen
        name="settings"
        options={{ ...modalHeaderOptions, headerShown: true }}
      />
    </Stack>
  );
}
