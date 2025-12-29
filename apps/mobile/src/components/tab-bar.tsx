import type { MaterialTopTabBarProps } from "@react-navigation/material-top-tabs";
import { Animated, Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ActivityRecDuoDark, HomeDuoDark, PlusRecDuoDark } from "@/icons";
import { mauveDark } from "@/utils/colors";

export const TAB_BAR_HEIGHT = 72;

export default function TabBar({
  navigation,
  position,
  state,
}: MaterialTopTabBarProps) {
  const insets = useSafeAreaInsets();
  const inputRange = state.routes.map((_, i) => i);
  const translateY = position.interpolate({
    inputRange,
    outputRange: inputRange.map((i) =>
      i === 0 ? TAB_BAR_HEIGHT + insets.bottom : 0
    ),
  });

  const addExpenseRoute = state.routes.find(
    ({ name }) => name === "add-expense"
  );
  const dashboardRoute = state.routes.find(
    ({ name }) => name === "(dashboard)"
  );
  const txnsRoute = state.routes.find(({ name }) => name === "transactions");

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
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!(isFocused || event.defaultPrevented)) {
              navigation.navigate(route.name);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: "tabLongPress",
              target: route.key,
            });
          };

          const createOpacityInterpolation = (
            activeValue: number,
            inactiveValue: number
          ) =>
            position.interpolate({
              inputRange,
              outputRange: inputRange.map((i) =>
                i === index ? activeValue : inactiveValue
              ),
            });

          const opacity = createOpacityInterpolation(1, 0.5);
          const fillOpacity = createOpacityInterpolation(1, 0.2);
          const outlineOpacity = createOpacityInterpolation(0, 1);

          return (
            <View key={route.key}>
              <Pressable
                className="transition-all active:scale-90"
                hitSlop={10}
                onLongPress={onLongPress}
                onPress={onPress}
              >
                <Animated.View style={{ opacity }}>
                  {route.name === addExpenseRoute?.name && (
                    <PlusRecDuoDark
                      color={mauveDark.mauveDark12}
                      fillOpacity={fillOpacity}
                      outlineOpacity={outlineOpacity}
                    />
                  )}

                  {route.name === dashboardRoute?.name && (
                    <HomeDuoDark
                      color={mauveDark.mauveDark12}
                      fillOpacity={fillOpacity}
                      outlineOpacity={outlineOpacity}
                    />
                  )}

                  {route.name === txnsRoute?.name && (
                    <ActivityRecDuoDark
                      color={mauveDark.mauveDark12}
                      fillOpacity={fillOpacity}
                      outlineOpacity={outlineOpacity}
                    />
                  )}
                </Animated.View>
              </Pressable>
            </View>
          );
        })}
      </View>
    </Animated.View>
  );
}
