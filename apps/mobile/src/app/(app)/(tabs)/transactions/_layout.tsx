import { Stack } from "expo-router";
import { useThemeColor } from "@/components/theme-provider";

export default function HistoryLayout() {
  const backgroundColor = useThemeColor("background");

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        contentStyle: { backgroundColor },
      }}
    />
  );
}
