import { View } from "react-native";
import { AnimatedBlurOverlay } from "@/components/animated-blur-overlay";
// import TabBarText from "@/components/tab-bar-text";
import TabBar from "@/components/tab-bar";
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
        screenOptions={{
          sceneStyle: {
            backgroundColor: isDark
              ? themeDark.background.tertiary
              : theme.background.tertiary,
          },
        }}
        // tabBar={TabBarText}
        // tabBarPosition="top"
        tabBar={TabBar}
        tabBarPosition="bottom"
      >
        <MaterialTopTabs.Screen name="add-expense" />
        <MaterialTopTabs.Screen name="(dashboard)" />
        <MaterialTopTabs.Screen name="spending" />
        <MaterialTopTabs.Screen name="transactions" />
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
