import { Stack } from "expo-router";
import { Platform } from "react-native";
import { AnimatedTabScreen } from "@/components/animated-tab-screen";
import { useThemeColor } from "@/components/theme-provider";

export default function MainLayout() {
  const backgroundColor = useThemeColor("background");

  return (
    <AnimatedTabScreen index={0}>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor },
        }}
      >
        <Stack.Screen name="(home)" />
        <Stack.Screen
          name="fund/[id]"
          options={{
            animation: Platform.OS === "ios" ? "default" : "slide_from_bottom",
          }}
        />
      </Stack>
    </AnimatedTabScreen>
  );
}
