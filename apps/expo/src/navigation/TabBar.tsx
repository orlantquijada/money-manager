import type {
  MaterialTopTabBarProps,
  MaterialTopTabNavigationOptions,
} from "@react-navigation/material-top-tabs";
import { MotiView } from "moti";
import { Animated, View } from "react-native";
import ScaleDownPressable from "~/components/ScaleDownPressable";
import { screenPadding } from "~/utils/constants";
// import { useIsKeyboardShown } from "~/utils/hooks/useIsKeyboardShown"
import { transitions } from "~/utils/motion";

// const iconSize = {
//   small: 20,
//   large: 24,
// }

const tabbarHeight = 72;
export const tabbarBottomInset = 16;
export const totalContentInset = tabbarBottomInset + tabbarHeight;

export default function TabBar({
  state,
  descriptors,
  navigation,
  position,
}: MaterialTopTabBarProps) {
  const inputRange = state.routes.map((_, i) => i);
  const translateY = position.interpolate({
    inputRange,
    outputRange: inputRange.map((i) =>
      i === 0 ? tabbarHeight + tabbarBottomInset : 0
    ),
  });

  return (
    <Animated.View style={{ transform: [{ translateY }] }}>
      <MotiView
        animate={{ translateY: -tabbarBottomInset }}
        className="absolute right-0 bottom-0 left-0 flex-row items-center justify-center space-x-10 rounded-[20px] bg-mauve12"
        from={{ translateY: tabbarHeight }}
        style={{
          marginHorizontal: screenPadding,
          height: tabbarHeight,
        }}
        transition={{
          ...transitions.snappy,
          translateY: { delay: 500 },
        }}
        // animate={
        //   shown
        //     ? {
        //         bottom: 0,
        //         marginHorizontal: 0,
        //         borderBottomLeftRadius: 0,
        //         borderBottomRightRadius: 0,
        //         height: 52,
        //       }
        //     : {
        //         bottom: 16,
        //         marginHorizontal: screenPadding,
        //         borderBottomLeftRadius: 20,
        //         borderBottomRightRadius: 20,
        //         height: 72,
        //       }
        // }
        // overlap of content bec of `bottom` prop
        // style={shown ? { marginTop: 0 } : { marginTop: 16 }}
      >
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key] as {
            options: MaterialTopTabNavigationOptions;
          };
          const Icon = options.tabBarIcon;

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

          const opacity = position.interpolate({
            inputRange,
            outputRange: inputRange.map((i) => (i === index ? 1 : 0.5)),
          });

          return (
            <View key={route.key}>
              <ScaleDownPressable
                hitSlop={{
                  bottom: 10,
                  right: 10,
                  left: 10,
                  top: 10,
                }}
                onLongPress={onLongPress}
                onPress={onPress}
                scale={0.9}
              >
                {/* {Icon ? ( */}
                {/*   <MotiView */}
                {/*     animate={ */}
                {/*       shown */}
                {/*         ? { height: iconSize.small, width: iconSize.small } */}
                {/*         : { height: iconSize.large, width: iconSize.large } */}
                {/*     } */}
                {/*     transition={transitions.snappy} */}
                {/*   > */}
                {/*     <Icon focused={isFocused} /> */}
                {/*   </MotiView> */}
                {/* ) : null} */}
                {Icon ? (
                  <Animated.View style={{ opacity }}>
                    {/* @ts-expect-error annoyting to handle (just check https://reactnavigation.org/docs/bottom-tab-navigator/) */}
                    <Icon focused={isFocused} />
                  </Animated.View>
                ) : null}
              </ScaleDownPressable>
            </View>
          );
        })}
      </MotiView>
    </Animated.View>
  );
}
