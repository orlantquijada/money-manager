import TabBar from "@/components/tab-bar";
import MaterialTopTabs from "@/navigators/material-top-tabs";

export default function TabLayout() {
  return (
    <MaterialTopTabs tabBar={TabBar} tabBarPosition="bottom">
      <MaterialTopTabs.Screen name="add-expense" />
      <MaterialTopTabs.Screen name="index" />
      <MaterialTopTabs.Screen name="transactions" />
    </MaterialTopTabs>
  );
}
