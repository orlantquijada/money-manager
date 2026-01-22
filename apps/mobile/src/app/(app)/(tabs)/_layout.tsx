import { View } from "react-native";
import { AnimatedBlurOverlay } from "@/components/animated-blur-overlay";
import FabOverlay from "@/components/fab-overlay";
import { useTheme } from "@/components/theme-provider";
import {
  TabPositionProvider,
  useTabPosition,
} from "@/contexts/tab-position-context";
import MaterialTopTabs from "@/navigators/material-top-tabs";
import { theme, themeDark } from "@/utils/colors";

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
        tabBar={FabOverlay}
        tabBarPosition="bottom"
      >
        {/*
        Screen order determines AnimatedTabScreen indexes:
          0: add-expense
          1: (main) - contains NativeTabs for dashboard/insights/transactions
        If you change the order here, update AnimatedTabScreen index prop!
      */}
        <MaterialTopTabs.Screen name="add-expense" />
        <MaterialTopTabs.Screen name="(main)" />
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
