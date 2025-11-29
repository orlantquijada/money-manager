import clsx from "clsx";
import { Pressable, Switch as RNSwitch, View } from "react-native";
import Animated, {
  LinearTransition,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { mauve, violet } from "~/utils/colors";
import useToggle from "~/utils/hooks/useToggle";
import { transitions } from "~/utils/motion";

export default function Switch() {
  const [open, { toggle, on, off }] = useToggle(false);

  const style = useAnimatedStyle(() => ({
    backgroundColor: withSpring(
      open ? violet.violet8 : mauve.mauve5,
      transitions.snappy
    ),
  }));

  const didLongPress = useSharedValue(0);

  const thumbStyle = useAnimatedStyle(() => ({
    width: didLongPress.value
      ? withTiming(36, { duration: 100 })
      : withTiming(28, { duration: 100 }),
  }));

  return (
    <View className="gap-y-4">
      <RNSwitch
        onValueChange={(value) => {
          if (value) {
            on();
          } else {
            off();
          }
        }}
        value={open}
      />

      <Pressable
        delayLongPress={100}
        onLongPress={() => {
          console.log("saasdas");
          didLongPress.value = 1;
        }}
        onPressOut={() => {
          didLongPress.value = 0;
          toggle();
        }}
      >
        <Animated.View
          className={clsx(
            // "h-6 w-[42px] justify-center rounded-full bg-red-300 p-0.5",
            "h-[32px] w-[52px] justify-center rounded-full px-0.5 py-1",
            open ? "items-end" : "items-start"
          )}
          style={style}
        >
          <Animated.View
            className="h-[28px] rounded-full bg-white"
            layout={LinearTransition.springify().stiffness(300).damping(30)}
            style={thumbStyle}
          />
        </Animated.View>
      </Pressable>
    </View>
  );
}
