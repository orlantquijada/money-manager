import { Icon, Label, NativeTabs } from "expo-router/unstable-native-tabs";
import { Platform } from "react-native";
import { AnimatedTabScreen } from "@/components/animated-tab-screen";
import { useThemeColor } from "@/components/theme-provider";

export default function MainLayout() {
  const foregroundColor = useThemeColor("foreground");

  return (
    <AnimatedTabScreen index={1}>
      <NativeTabs minimizeBehavior="onScrollDown" tintColor={foregroundColor}>
        <NativeTabs.Trigger name="(dashboard)">
          {Platform.OS === "ios" && (
            <Icon sf={{ default: "house", selected: "house.fill" }} />
          )}
          <Label>Home</Label>
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="spending">
          {Platform.OS === "ios" && (
            <Icon sf={{ default: "chart.bar", selected: "chart.bar.fill" }} />
          )}
          <Label>Insights</Label>
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="transactions">
          {Platform.OS === "ios" && (
            <Icon sf={{ default: "clock", selected: "clock.fill" }} />
          )}
          <Label>History</Label>
        </NativeTabs.Trigger>
      </NativeTabs>
    </AnimatedTabScreen>
  );
}
