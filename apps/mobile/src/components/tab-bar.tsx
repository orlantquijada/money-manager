import type { MaterialTopTabBarProps } from "@react-navigation/material-top-tabs";
import { GlassView } from "expo-glass-effect";
import type { ComponentType } from "react";
import { useCallback, useMemo } from "react";
import { Animated, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StyledLeanText, StyledLeanView } from "@/config/interop";
import { useSyncTabPosition } from "@/hooks/use-sync-tab-position";
import { useTabChangeHaptics } from "@/hooks/use-tab-change-haptics";
import { ActivityRecDuoDark, HomeDuoDark, PlusRecDuoDark } from "@/icons";
import type { TabBarIconProps } from "@/utils/types";
import { ScalePressable } from "./scale-pressable";
import { useThemeColor } from "./theme-provider";

// export const TAB_BAR_HEIGHT = 72;
export const TAB_BAR_HEIGHT = 64;

type RouteConfig = {
  name: string;
  label: string;
  icon: ComponentType<TabBarIconProps>;
};

const ROUTE_CONFIG: RouteConfig[] = [
  { name: "(dashboard)", label: "Home", icon: HomeDuoDark },
  { name: "add-expense", label: "Add", icon: PlusRecDuoDark },
  { name: "transactions", label: "Spending", icon: ActivityRecDuoDark },
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
  const height = useTabBarHeight();

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
    <Animated.View
      className="absolute inset-x-0 bottom-0"
      style={{
        height,
        transform: [{ translateY }],
      }}
    >
      <GlassView
        glassEffectStyle="regular"
        isInteractive
        style={StyleSheet.absoluteFill}
      >
        <StyledLeanView
          className="absolute inset-0 flex-row items-center justify-center px-4"
          style={{ height: TAB_BAR_HEIGHT }}
        >
          <StyledLeanView className="w-full flex-row">
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
          </StyledLeanView>
        </StyledLeanView>
      </GlassView>
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

export function useTabBarHeight() {
  const insets = useSafeAreaInsets();
  return TAB_BAR_HEIGHT + insets.bottom;
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

  const tabBarColor = useThemeColor("tabBar-foreground");

  if (!config) return null;

  const Icon = config.icon;

  return (
    <ScalePressable
      className="w-1/3"
      disableOpacity
      hitSlop={10}
      onLongPress={handleLongPress}
      onPress={handlePress}
      scaleValue={1.25}
    >
      <Animated.View className="items-center gap-1" style={{ opacity }}>
        <Icon
          color={tabBarColor}
          fillOpacity={fillOpacity}
          outlineOpacity={outlineOpacity}
        />
        <StyledLeanText
          className="font-satoshi-medium text-xs"
          style={{ color: tabBarColor }}
        >
          {config.label}
        </StyledLeanText>
      </Animated.View>
    </ScalePressable>
  );
}
