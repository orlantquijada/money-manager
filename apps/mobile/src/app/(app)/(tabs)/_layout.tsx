import type { MaterialTopTabBarProps } from "@react-navigation/material-top-tabs";
import { View } from "react-native";
import { AnimatedBlurOverlay } from "@/components/animated-blur-overlay";
import { useTheme } from "@/components/theme-provider";
import {
  TabPositionProvider,
  useTabPosition,
} from "@/contexts/tab-position-context";
import { useSyncTabPosition } from "@/hooks/use-sync-tab-position";
import { useTabChangeHaptics } from "@/hooks/use-tab-change-haptics";
import MaterialTopTabs from "@/navigators/material-top-tabs";
import { theme, themeDark } from "@/utils/colors";

function HiddenTabBar({ position, state }: MaterialTopTabBarProps) {
  useSyncTabPosition(position, state.routes);
  useTabChangeHaptics(state.index);
  return <View className="absolute" />;
}

function TabsContent() {
  const { position, routes } = useTabPosition();
  const { isDark } = useTheme();

  return (
    <View className="flex-1">
      <MaterialTopTabs
        initialRouteName="(main)"
        screenOptions={{
          sceneStyle: {
            backgroundColor: isDark
              ? themeDark.background.tertiary
              : theme.background.tertiary,
          },
        }}
        tabBar={HiddenTabBar}
        tabBarPosition="bottom"
      >
        {/*
        Screen order determines AnimatedTabScreen indexes:
          0: (main) - contains Tabs for dashboard/insights/transactions
          1: add-expense
        If you change the order here, update AnimatedTabScreen index prop!
      */}
        <MaterialTopTabs.Screen name="(main)" />
        <MaterialTopTabs.Screen name="add-expense" />
      </MaterialTopTabs>

      {position && routes.length > 0 && (
        <AnimatedBlurOverlay position={position} routes={routes} />
      )}
    </View>
  );
}

export default function TabLayout() {
  return (
    <TabPositionProvider>
      <TabsContent />
    </TabPositionProvider>
  );
}
