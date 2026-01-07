import { Stack } from "expo-router";
import type { ComponentProps } from "react";
import { useThemeColor } from "@/components/theme-provider";

const modalHeaderOptions = {
  presentation: "modal",
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
    </Stack>
  );
}
