import type { MaterialTopTabBarProps } from "@react-navigation/material-top-tabs";
import { GlassContainer, GlassView } from "expo-glass-effect";
import type { ComponentType } from "react";
import { useCallback, useMemo } from "react";
import { Animated } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import GlassButton from "@/components/glass-button";
import { StyledLeanView } from "@/config/interop";
import { useSyncTabPosition } from "@/hooks/use-sync-tab-position";
import { useTabChangeHaptics } from "@/hooks/use-tab-change-haptics";
import {
  ActivityRecDuoDark,
  ChartColumnDuoDark,
  HomeDuoDark,
  Plus,
  PlusRecDuoDark,
} from "@/icons";
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
  { name: "spending", label: "Insights", icon: ChartColumnDuoDark },
  { name: "transactions", label: "History", icon: ActivityRecDuoDark },
];

const ROUTE_MAP = new Map(ROUTE_CONFIG.map((config) => [config.name, config]));

const FAB_GAP = 12;

export default function TabBar({
  navigation,
  position,
  state,
}: MaterialTopTabBarProps) {
  const insets = useSafeAreaInsets();
  useSyncTabPosition(position, state.routes);
  useTabChangeHaptics(state.index);

  const fabIconColor = useThemeColor("foreground");
  // const fabTintColor = useThemeColor("background");
  const fabTintColor = undefined;

  // Get visible tabs (those in ROUTE_MAP) with their actual navigator positions
  const visibleTabs = useMemo(
    () =>
      state.routes
        .map((route, index) => ({ route, position: index }))
        .filter(({ route }) => ROUTE_MAP.has(route.name)),
    [state.routes]
  );

  // Input range uses actual navigator positions of visible tabs
  const tabInputRange = useMemo(
    () => visibleTabs.map(({ position: pos }) => pos),
    [visibleTabs]
  );

  // Full input range for translateY (includes add-expense at position 0)
  const fullInputRange = useMemo(
    () => state.routes.map((_, i) => i),
    [state.routes]
  );

  const translateY = useMemo(
    () =>
      position.interpolate({
        inputRange: fullInputRange,
        outputRange: fullInputRange.map((i) =>
          i === 0 ? TAB_BAR_HEIGHT + insets.bottom : 0
        ),
      }),
    [position, fullInputRange, insets.bottom]
  );

  const handleFabPress = useCallback(() => {
    navigation.navigate("add-expense");
  }, [navigation]);

  return (
    <Animated.View
      className="absolute right-4 left-4"
      style={{
        height: TAB_BAR_HEIGHT,
        bottom: insets.bottom,
        transform: [{ translateY }],
      }}
    >
      <GlassContainer
        spacing={FAB_GAP}
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          // justifyContent: "center",
        }}
      >
        <GlassView
          glassEffectStyle="regular"
          isInteractive
          style={{
            // flex: 1,
            height: TAB_BAR_HEIGHT,
            borderRadius: 999,
            borderCurve: "continuous",
          }}
          tintColor={fabTintColor}
        >
          <StyledLeanView className="h-full flex-row items-center justify-evenly">
            {visibleTabs.map(({ route, position: tabPosition }) => (
              <TabItem
                inputRange={tabInputRange}
                isFocused={state.index === tabPosition}
                key={route.key}
                navigation={navigation}
                position={position}
                route={route}
                tabPosition={tabPosition}
              />
            ))}
          </StyledLeanView>
        </GlassView>

        <GlassButton
          onPress={handleFabPress}
          size="xxl"
          // style={{ marginLeft: FAB_GAP }}
          tintColor={fabTintColor}
          variant="icon"
        >
          <Plus color={fabIconColor} size={24} />
        </GlassButton>
      </GlassContainer>
    </Animated.View>
  );
}

function useTabBarAnimations(
  position: MaterialTopTabBarProps["position"],
  inputRange: number[],
  tabPosition: number
) {
  return useMemo(() => {
    const createInterpolation = (activeValue: number, inactiveValue: number) =>
      position.interpolate({
        inputRange,
        outputRange: inputRange.map((pos) =>
          pos === tabPosition ? activeValue : inactiveValue
        ),
      });

    return {
      opacity: createInterpolation(1, 0.5),
      fillOpacity: createInterpolation(1, 0.2),
      outlineOpacity: createInterpolation(0, 1),
    };
  }, [position, inputRange, tabPosition]);
}

export function useTabBarHeight() {
  const insets = useSafeAreaInsets();
  return TAB_BAR_HEIGHT + insets.bottom;
}

type TabItemProps = {
  route: MaterialTopTabBarProps["state"]["routes"][number];
  tabPosition: number;
  isFocused: boolean;
  position: MaterialTopTabBarProps["position"];
  inputRange: number[];
  navigation: MaterialTopTabBarProps["navigation"];
};

function TabItem({
  route,
  tabPosition,
  isFocused,
  position,
  inputRange,
  navigation,
}: TabItemProps) {
  const { opacity, fillOpacity, outlineOpacity } = useTabBarAnimations(
    position,
    inputRange,
    tabPosition
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
      // className="w-1/3"
      // className="px-4 py-2"
      className="h-full items-center justify-center px-6"
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
      </Animated.View>
    </ScalePressable>
  );
}
