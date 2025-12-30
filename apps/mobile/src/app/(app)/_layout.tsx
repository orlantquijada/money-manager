import { Stack } from "expo-router";
import { mauveDark, violet } from "@/utils/colors";

export default function AppLayout() {
  return (
    <Stack initialRouteName="(tabs)" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen
        name="create-fund"
        options={{
          presentation: "modal",
          contentStyle: {
            backgroundColor: mauveDark.mauveDark1,
          },
        }}
      />
      <Stack.Screen
        name="create-folder"
        options={{
          presentation: "modal",
          contentStyle: {
            backgroundColor: mauveDark.mauveDark1,
          },
        }}
      />
      <Stack.Screen
        name="fund/[id]"
        options={{
          presentation: "modal",
          contentStyle: {
            backgroundColor: violet.violet1,
          },
        }}
      />
    </Stack>
  );
}
