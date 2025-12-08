import {
  createMaterialTopTabNavigator,
  type MaterialTopTabBarProps,
  type MaterialTopTabNavigationEventMap,
  type MaterialTopTabNavigationOptions,
} from "@react-navigation/material-top-tabs";
import type {
  ParamListBase,
  TabNavigationState,
} from "@react-navigation/native";
import { withLayoutContext } from "expo-router";
import Animated from "react-native-reanimated";

const { Navigator } = createMaterialTopTabNavigator();
const MaterialTopTabs = withLayoutContext<
  MaterialTopTabNavigationOptions,
  typeof Navigator,
  TabNavigationState<ParamListBase>,
  MaterialTopTabNavigationEventMap
>(Navigator);

export default function TabLayout() {
  return (
    <MaterialTopTabs
      tabBar={(props) => <TabBar {...props} />}
      tabBarPosition="bottom"
    >
      <MaterialTopTabs.Screen name="add-expense" />
      <MaterialTopTabs.Screen name="index" />
      <MaterialTopTabs.Screen name="transactions" />
    </MaterialTopTabs>
  );
}

const tabbarHeight = 72;
export const tabbarBottomInset = 16;
export const totalContentInset = tabbarBottomInset + tabbarHeight;

function TabBar({
  descriptors,
  jumpTo,
  layout,
  navigation,
  position,
  state,
}: MaterialTopTabBarProps) {
  const inputRange = state.routes.map((_, i) => i);
  // const translateY = position.interpolate({
  //   inputRange,
  //   outputRange: inputRange.map((i) =>
  //     i === 0 ? tabbarHeight + tabbarBottomInset : 0
  //   ),
  // });

  return (
    <Animated.View>
      <Animated.View
        className="absolute right-0 bottom-safe left-0 mx-4 flex-row items-center justify-center space-x-10 rounded-[20px] bg-mauve12"
        style={{
          height: tabbarHeight,
        }}
      />
    </Animated.View>
  );
}
