import { Stack } from "expo-router";
import { Platform } from "react-native";
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
        headerBackButtonDisplayMode: "minimal",
        animation: Platform.OS === "ios" ? "default" : "ios_from_right",
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
