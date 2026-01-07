import { cva, type VariantProps } from "class-variance-authority";
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
import { cn } from "@/utils/cn";
import { TW_TRANSITION_ALL } from "@/utils/motion";

const buttonVariants = cva(
  "relative items-center justify-center gap-2 rounded-xl",
  {
    variants: {
      variant: {
        default: "",
      },
      size: {
        default: "h-8 px-4",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);

type Props = Omit<ScalePressableProps, "style"> &
  VariantProps<typeof buttonVariants> & {
    style?: StyleProp<ViewStyle>;
  };

export default function Button({
  className,
  size,
  variant,
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

  return (
    <ScalePressable
      {...props}
      className={cn(buttonVariants({ size, variant, className }))}
      disabled={disabled}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[animatedStyle, style]}
    />
  );
}
