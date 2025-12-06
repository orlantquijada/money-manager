import { Tabs } from "expo-router";

import { IconSymbol } from "@/components/ui/icon-symbol";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <IconSymbol color={color} name="house.fill" size={28} />
          ),
        }}
      />
    </Tabs>
  );
}
