import { useCallback, useEffect } from "react";
import type { StyleProp, ViewStyle } from "react-native";
import {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import {
  ScalePressable,
  type ScalePressableProps,
} from "@/components/scale-pressable";
import { useThemeColor } from "@/components/theme-provider";
import {
  type ButtonSize,
  type ButtonVariant,
  iconSizeClasses,
  paddingBySize,
} from "@/components/ui/button-tokens";
import { cn } from "@/utils/cn";
import { TW_TRANSITION_ALL } from "@/utils/motion";

type Props = Omit<ScalePressableProps, "style"> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  style?: StyleProp<ViewStyle>;
};

export default function Button({
  className,
  size = "lg",
  variant = "default",
  disabled,
  onPressIn,
  onPressOut,
  style,
  ...props
}: Props) {
  const foreground = useThemeColor("foreground");
  const foregroundSecondary = useThemeColor("foreground-secondary");

  const colorProgress = useSharedValue(disabled ? 1 : 0);

  // Animate to disabled state when prop changes
  useEffect(() => {
    colorProgress.value = withTiming(disabled ? 1 : 0, TW_TRANSITION_ALL);
  }, [disabled, colorProgress]);

  const animatedStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      colorProgress.value,
      [0, 1],
      [foreground, foregroundSecondary]
    ),
  }));

  const handlePressIn = useCallback<
    NonNullable<ScalePressableProps["onPressIn"]>
  >(
    (e) => {
      if (!disabled) {
        colorProgress.value = withTiming(1, TW_TRANSITION_ALL);
      }
      onPressIn?.(e);
    },
    [colorProgress, disabled, onPressIn]
  );

  const handlePressOut = useCallback<
    NonNullable<ScalePressableProps["onPressOut"]>
  >(
    (e) => {
      if (!disabled) {
        colorProgress.value = withTiming(0, TW_TRANSITION_ALL);
      }
      onPressOut?.(e);
    },
    [colorProgress, disabled, onPressOut]
  );

  const isIcon = variant === "icon";
  const sizeClass = isIcon ? iconSizeClasses[size] : undefined;

  return (
    <ScalePressable
      {...props}
      className={cn(
        "relative items-center justify-center gap-2 rounded-full",
        sizeClass,
        className
      )}
      disabled={disabled}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[
        animatedStyle,
        !isIcon && {
          paddingHorizontal: paddingBySize[size].horizontal,
          paddingVertical: paddingBySize[size].vertical,
        },
        style,
      ]}
    />
  );
}
