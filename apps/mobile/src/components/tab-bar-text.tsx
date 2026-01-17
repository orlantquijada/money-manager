import type { MaterialTopTabBarProps } from "@react-navigation/material-top-tabs";
import { useCallback, useMemo } from "react";
import { Animated, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StyledLeanText, StyledLeanView } from "@/config/interop";
import { useSyncTabPosition } from "@/hooks/use-sync-tab-position";
import { useTabChangeHaptics } from "@/hooks/use-tab-change-haptics";
import { ScalePressable } from "./scale-pressable";
import { useThemeColor } from "./theme-provider";

export const TAB_BAR_TEXT_HEIGHT = 56;

type RouteConfig = {
  name: string;
  label: string;
};

const ROUTE_CONFIG: RouteConfig[] = [
  { name: "(dashboard)", label: "My budget" },
  { name: "add-expense", label: "Add" },
  { name: "transactions", label: "Spending" },
];

const ROUTE_MAP = new Map(ROUTE_CONFIG.map((config) => [config.name, config]));

export default function TabBarText({
  navigation,
  position,
  state,
}: MaterialTopTabBarProps) {
  const insets = useSafeAreaInsets();
  useSyncTabPosition(position, state.routes);
  useTabChangeHaptics(state.index);
  const height = useTabBarTextHeight();

  const inputRange = useMemo(
    () => state.routes.map((_, i) => i),
    [state.routes]
  );

  // Hide tab bar when on add-expense (index 0 based on route order)
  const translateY = useMemo(
    () =>
      position.interpolate({
        inputRange,
        outputRange: inputRange.map((i) =>
          i === 0 ? -(TAB_BAR_TEXT_HEIGHT + insets.top) : 0
        ),
      }),
    [position, inputRange, insets.top]
  );

  return (
    <Animated.View
      style={{
        height,
        transform: [{ translateY }],
      }}
    >
      <ScrollView
        className="pt-safe"
        contentContainerClassName="min-w-screen px-3"
        horizontal
      >
        <StyledLeanView className="flex-row items-start gap-1.5">
          {state.routes.map((route, index) => (
            <TabTextItem
              index={index}
              inputRange={inputRange}
              isFocused={state.index === index}
              key={route.key}
              navigation={navigation}
              position={position}
              route={route}
            />
          ))}
        </StyledLeanView>
      </ScrollView>
    </Animated.View>
  );
}

export function useTabBarTextHeight() {
  const insets = useSafeAreaInsets();
  return TAB_BAR_TEXT_HEIGHT + insets.top;
}

type TabTextItemProps = {
  route: MaterialTopTabBarProps["state"]["routes"][number];
  index: number;
  isFocused: boolean;
  position: MaterialTopTabBarProps["position"];
  inputRange: number[];
  navigation: MaterialTopTabBarProps["navigation"];
};

function TabTextItem({
  route,
  index,
  isFocused,
  position,
  inputRange,
  navigation,
}: TabTextItemProps) {
  const opacity = useMemo(
    () =>
      position.interpolate({
        inputRange,
        outputRange: inputRange.map((i) => (i === index ? 1 : 0.4)),
      }),
    [position, inputRange, index]
  );

  const scale = useMemo(
    () =>
      position.interpolate({
        inputRange,
        outputRange: inputRange.map((i) => (i === index ? 1 : 0.95)),
      }),
    [position, inputRange, index]
  );

  const config = ROUTE_MAP.get(route.name);
  const tabBarColor = useThemeColor("tabBar-foreground");

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

  return (
    <ScalePressable
      className="px-3 py-1.5"
      disableOpacity
      hitSlop={12}
      onLongPress={handleLongPress}
      onPress={handlePress}
      scaleValue={1.1}
    >
      <Animated.View style={{ opacity, transform: [{ scale }] }}>
        <StyledLeanText
          className="font-satoshi-medium text-base"
          style={{ color: tabBarColor }}
        >
          {config.label}
        </StyledLeanText>
      </Animated.View>
    </ScalePressable>
  );
}
