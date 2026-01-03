import { View } from "react-native";
import { AnimatedBlurOverlay } from "@/components/animated-blur-overlay";
import TabBar from "@/components/tab-bar";
import {
  TabPositionProvider,
  useTabPosition,
} from "@/contexts/tab-position-context";
import MaterialTopTabs from "@/navigators/material-top-tabs";

function TabsContent() {
  const { position, routes } = useTabPosition();

  return (
    <View style={{ flex: 1 }}>
      <MaterialTopTabs tabBar={TabBar} tabBarPosition="bottom">
        <MaterialTopTabs.Screen name="add-expense" />
        <MaterialTopTabs.Screen name="(dashboard)" />
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
