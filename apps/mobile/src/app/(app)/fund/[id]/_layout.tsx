import { Stack } from "expo-router";
import { useThemeColor } from "@/components/theme-provider";

export default function FundLayout() {
  const backgroundColor = useThemeColor("background");
  const foregroundColor = useThemeColor("foreground");
  const headerTintColor = useThemeColor("foreground-muted");

  return (
    <Stack
      screenOptions={{
        headerTintColor,
        headerShown: true,
        headerTransparent: true,
        headerBlurEffect: "none",
        headerTitleStyle: { color: foregroundColor },
        contentStyle: { backgroundColor },
        animation: "simple_push",
        headerBackButtonDisplayMode: "minimal",
      }}
    >
      <Stack.Screen name="index" options={{ title: "" }} />
      <Stack.Screen
        name="transactions"
        options={{
          title: "Transactions",
        }}
      />
    </Stack>
  );
}
