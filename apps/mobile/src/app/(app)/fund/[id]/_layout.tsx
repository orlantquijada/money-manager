import { Stack } from "expo-router";
import { useThemeColor } from "@/components/theme-provider";

export default function FundLayout() {
  const backgroundColor = useThemeColor("background");

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor },
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="transactions" />
    </Stack>
  );
}
