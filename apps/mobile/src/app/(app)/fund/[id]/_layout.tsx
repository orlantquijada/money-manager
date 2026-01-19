import { Stack } from "expo-router";
import { useThemeColor } from "@/components/theme-provider";

export default function FundLayout() {
  const backgroundColor = useThemeColor("background");
  const foregroundColor = useThemeColor("foreground");

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerTransparent: true,
        headerBlurEffect: "none",
        headerTitleStyle: { color: foregroundColor },
        contentStyle: { backgroundColor },
        animation: "simple_push",
        headerBackButtonDisplayMode: "minimal",
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen
        name="transactions"
        options={{
          title: "Transactions",
        }}
      />
    </Stack>
  );
}
