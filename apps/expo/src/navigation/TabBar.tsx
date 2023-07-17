import { Pressable } from "react-native"
import { MotiView, TransitionConfig } from "moti"
import {
  MaterialTopTabBarProps,
  MaterialTopTabNavigationOptions,
} from "@react-navigation/material-top-tabs"

import { screenPadding } from "~/utils/constants"
import { useIsKeyboardShown } from "~/utils/hooks/useIsKeyboardShown"

const transitionConfig: TransitionConfig = {
  stiffness: 200,
  damping: 30,
}

const iconSize = {
  small: 20,
  large: 24,
}

export default function TabBar({
  state,
  descriptors,
  navigation,
}: MaterialTopTabBarProps) {
  const shown = useIsKeyboardShown()

  return (
    <MotiView
      className="bg-mauve12 flex-row items-center justify-center rounded-[20px]"
      // className="bg-mauve12 left-0 right-0 bottom-0 mx-4 mb-4 h-[72px] flex-row items-center justify-center rounded-2xl"
      // animate={{ opacity: shown ? 0 : 1, translateY: shown ? 72 : 0 }}
      animate={
        shown
          ? {
              bottom: 0,
              marginHorizontal: 0,
              borderBottomLeftRadius: 0,
              borderBottomRightRadius: 0,
              height: 52,
            }
          : {
              bottom: 16,
              marginHorizontal: screenPadding,
              borderBottomLeftRadius: 20,
              borderBottomRightRadius: 20,
              height: 72,
            }
      }
      // overlap of content bec of `bottom` prop
      style={shown ? { marginTop: 0 } : { marginTop: 16 }}
      transition={transitionConfig}
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key] as {
          options: MaterialTopTabNavigationOptions
        }
        const Icon = options.tabBarIcon

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
          <Pressable
            onPress={onPress}
            onLongPress={onLongPress}
            style={index === 0 ? {} : { marginLeft: 40 }}
            key={route.key}
            hitSlop={15}
          >
            {Icon ? (
              <MotiView
                animate={
                  shown
                    ? { height: iconSize.small, width: iconSize.small }
                    : { height: iconSize.large, width: iconSize.large }
                }
                transition={transitionConfig}
              >
                {/* @ts-expect-error annoyting to handle (just check https://reactnavigation.org/docs/bottom-tab-navigator/) */}
                <Icon focused={isFocused} />
              </MotiView>
            ) : null}
          </Pressable>
        )
      })}
    </MotiView>
  )
}
