import { View, Text } from "react-native"
import { MaterialTopTabBarProps } from "@react-navigation/material-top-tabs"
import clsx from "clsx"

import ScaleDownPressable from "./ScaleDownPressable"

export default function HomeTabBar({
  state,
  navigation,
}: MaterialTopTabBarProps) {
  return (
    <View className="border-b-mauve5 flex-row space-x-2 border-b">
      {state.routes.map((route, index) => {
        // const { options } = descriptors[route.key] as {
        //   options: MaterialTopTabNavigationOptions
        // }
        const isFocused = state.index === index

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          })

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name)
          }
        }

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          })
        }

        return (
          <ScaleDownPressable
            onPress={onPress}
            onLongPress={onLongPress}
            key={route.key}
            className="h-12 justify-center px-2"
          >
            <Text
              className={clsx(
                "text-mauve10 font-satoshi-bold text-base",
                isFocused && "text-mauve12",
              )}
            >
              {route.name}
            </Text>

            {isFocused && (
              <View className="bg-mauve12 absolute left-0 right-0 bottom-0 h-0.5" />
            )}
          </ScaleDownPressable>
        )
      })}
    </View>
  )
}
