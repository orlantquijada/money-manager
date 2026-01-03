import type { MaterialTopTabBarProps } from "@react-navigation/material-top-tabs";
import type { ComponentType } from "react";
import { useCallback, useMemo } from "react";
import { Animated, Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSyncTabPosition } from "@/hooks/use-sync-tab-position";
import { useTabChangeHaptics } from "@/hooks/use-tab-change-haptics";
import { ActivityRecDuoDark, HomeDuoDark, PlusRecDuoDark } from "@/icons";
import { mauveDark } from "@/utils/colors";
import type { TabBarIconProps } from "@/utils/types";

export const TAB_BAR_HEIGHT = 72;

type RouteConfig = {
  name: string;
  icon: ComponentType<TabBarIconProps>;
};

const ROUTE_CONFIG: RouteConfig[] = [
  { name: "(dashboard)", icon: HomeDuoDark },
  { name: "add-expense", icon: PlusRecDuoDark },
  { name: "transactions", icon: ActivityRecDuoDark },
];

const ROUTE_MAP = new Map(ROUTE_CONFIG.map((config) => [config.name, config]));

export default function TabBar({
  navigation,
  position,
  state,
}: MaterialTopTabBarProps) {
  const insets = useSafeAreaInsets();
  useSyncTabPosition(position, state.routes);
  useTabChangeHaptics(state.index);

  const inputRange = useMemo(
    () => state.routes.map((_, i) => i),
    [state.routes]
  );

  const translateY = useMemo(
    () =>
      position.interpolate({
        inputRange,
        outputRange: inputRange.map((i) =>
          i === 0 ? TAB_BAR_HEIGHT + insets.bottom : 0
        ),
      }),
    [position, inputRange, insets.bottom]
  );

  return (
    <Animated.View style={{ transform: [{ translateY }] }}>
      <View
        className="absolute inset-x-0 bottom-safe mx-4 flex-row items-center justify-center gap-x-10 bg-mauve12"
        style={{
          height: TAB_BAR_HEIGHT,
          borderRadius: 20,
          borderCurve: "continuous",
        }}
      >
        {state.routes.map((route, index) => (
          <TabItem
            index={index}
            inputRange={inputRange}
            isFocused={state.index === index}
            key={route.key}
            navigation={navigation}
            position={position}
            route={route}
          />
        ))}
      </View>
    </Animated.View>
  );
}

function useTabBarAnimations(
  position: MaterialTopTabBarProps["position"],
  inputRange: number[],
  index: number
) {
  return useMemo(() => {
    const createInterpolation = (activeValue: number, inactiveValue: number) =>
      position.interpolate({
        inputRange,
        outputRange: inputRange.map((i) =>
          i === index ? activeValue : inactiveValue
        ),
      });

    return {
      opacity: createInterpolation(1, 0.5),
      fillOpacity: createInterpolation(1, 0.2),
      outlineOpacity: createInterpolation(0, 1),
    };
  }, [position, inputRange, index]);
}

type TabItemProps = {
  route: MaterialTopTabBarProps["state"]["routes"][number];
  index: number;
  isFocused: boolean;
  position: MaterialTopTabBarProps["position"];
  inputRange: number[];
  navigation: MaterialTopTabBarProps["navigation"];
};

function TabItem({
  route,
  index,
  isFocused,
  position,
  inputRange,
  navigation,
}: TabItemProps) {
  const { opacity, fillOpacity, outlineOpacity } = useTabBarAnimations(
    position,
    inputRange,
    index
  );

  const config = ROUTE_MAP.get(route.name);

  const handlePress = useCallback(() => {
    const event = navigation.emit({
      type: "tabPress",
      target: route.key,
      canPreventDefault: true,
    });

    if (!(isFocused || event.defaultPrevented)) {
      navigation.navigate(route.name);
    }
  }, [navigation, route.key, route.name, isFocused]);

  const handleLongPress = useCallback(() => {
    navigation.emit({
      type: "tabLongPress",
      target: route.key,
    });
  }, [navigation, route.key]);

  if (!config) return null;

  const Icon = config.icon;

  return (
    <Pressable
      className="transition-all active:scale-90"
      hitSlop={10}
      onLongPress={handleLongPress}
      onPress={handlePress}
    >
      <Animated.View style={{ opacity }}>
        <Icon
          color={mauveDark.mauveDark12}
          fillOpacity={fillOpacity}
          outlineOpacity={outlineOpacity}
        />
      </Animated.View>
    </Pressable>
  );
}
