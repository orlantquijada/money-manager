import { type ReactNode, useCallback } from "react";
import type { PressableProps, ViewProps, ViewStyle } from "react-native";
import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { StyledLeanView } from "@/config/interop";
import { ChevronLeft } from "@/icons";
import { cn } from "@/utils/cn";
import { TW_TRANSITION_ALL } from "@/utils/motion";
import { AnimatedPressable } from "../animated-pressable";
import { useThemeColor } from "../theme-provider";

function useNumberButtonAnimation(
  onPressIn?: PressableProps["onPressIn"],
  onPressOut?: PressableProps["onPressOut"]
) {
  const bgColor = useThemeColor("background");
  const activeBgColor = useThemeColor("muted");
  const pressed = useSharedValue(0);

  const pressableStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      pressed.value,
      [0, 1],
      [bgColor, activeBgColor]
    ),
  }));

  const textStyle = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(pressed.value, [0, 1], [1, 1.25]) }],
  }));

  const handlePressIn = useCallback(
    (e: Parameters<NonNullable<PressableProps["onPressIn"]>>[0]) => {
      pressed.value = withTiming(1, TW_TRANSITION_ALL);
      onPressIn?.(e);
    },
    [pressed, onPressIn]
  );

  const handlePressOut = useCallback(
    (e: Parameters<NonNullable<PressableProps["onPressOut"]>>[0]) => {
      pressed.value = withTiming(0, TW_TRANSITION_ALL);
      onPressOut?.(e);
    },
    [pressed, onPressOut]
  );

  return { pressableStyle, textStyle, handlePressIn, handlePressOut };
}

export type NumpadKey =
  | "0"
  | "1"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "."
  | "backspace";

function NumberButton({
  children,
  style,
  className,
  onPressIn,
  onPressOut,
  ...rest
}: PressableProps & { children?: ReactNode; style?: ViewStyle }) {
  const { pressableStyle, textStyle, handlePressIn, handlePressOut } =
    useNumberButtonAnimation(onPressIn, onPressOut);

  return (
    <AnimatedPressable
      {...rest}
      className={cn(
        "h-12 flex-1 items-center justify-center rounded-lg",
        className
      )}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[{ borderCurve: "continuous" }, pressableStyle, style]}
    >
      <Animated.Text
        className="font-nunito-bold text-2xl text-foreground"
        style={textStyle}
      >
        {children}
      </Animated.Text>
    </AnimatedPressable>
  );
}

type Props = ViewProps & {
  onPress?: (key: NumpadKey) => void;
};

export default function Numpad({ className, onPress, ...props }: Props) {
  return (
    <StyledLeanView {...props} className={cn("gap-2", className)}>
      {[
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
      ].map((row) => (
        <StyledLeanView className="flex-row gap-2" key={row[0]}>
          {row.map((num) => (
            <NumberButton
              key={num}
              onPress={() => onPress?.(String(num) as NumpadKey)}
            >
              {num}
            </NumberButton>
          ))}
        </StyledLeanView>
      ))}
      <StyledLeanView className="flex-row gap-2">
        <NumberButton onPress={() => onPress?.(".")}>.</NumberButton>
        <NumberButton onPress={() => onPress?.("0")}>0</NumberButton>
        <NumberButton onPress={() => onPress?.("backspace")}>
          <ChevronLeft
            className="text-foreground"
            size={20}
            strokeWidth={3.5}
          />
        </NumberButton>
      </StyledLeanView>
    </StyledLeanView>
  );
}
