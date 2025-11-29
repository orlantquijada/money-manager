import type { MaterialTopTabBarProps } from "@react-navigation/material-top-tabs";
import clsx from "clsx";
import { Text, View } from "react-native";
import { screenPadding } from "~/utils/constants";
import ScaleDownPressable from "./ScaleDownPressable";

export default function HomeTabBar({
  state,
  navigation,
}: MaterialTopTabBarProps) {
  return (
    <View className="flex-row space-x-2 border-b border-b-mauve5">
      {state.routes.map((route, index) => {
        // const { options } = descriptors[route.key] as {
        //   options: MaterialTopTabNavigationOptions
        // }
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

        return (
          <ScaleDownPressable
            className="h-12 justify-center px-2"
            key={route.key}
            onLongPress={onLongPress}
            onPress={onPress}
            style={index === 0 ? { marginLeft: screenPadding } : {}}
          >
            <Text
              className={clsx(
                "font-satoshi-bold text-base text-mauve10",
                isFocused && "text-mauve12"
              )}
            >
              {route.name}
            </Text>

            {isFocused && (
              <View className="absolute right-0 bottom-0 left-0 h-0.5 bg-mauve12" />
            )}
          </ScaleDownPressable>
        );
      })}
    </View>
  );
}
