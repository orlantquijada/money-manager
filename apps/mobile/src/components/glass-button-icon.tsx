import { GlassView, type GlassViewProps } from "expo-glass-effect";
import { router } from "expo-router";
import type { ReactNode } from "react";
import {
  Pressable,
  type PressableProps,
  StyleSheet,
  type ViewStyle,
} from "react-native";
import { useThemeColor } from "@/components/theme-provider";
import { Cross } from "@/icons";
import { cn } from "@/utils/cn";

type GlassButtonIconProps = PressableProps & {
  size?: "size-8" | "size-10" | "size-12";
  glassViewProps?: GlassViewProps;
  children?: ReactNode;
  tintColor?: string;
};

export default function GlassButtonIcon({
  className,
  children,
  size = "size-12",
  glassViewProps = {},
  tintColor: tintColorProp,
  ...props
}: GlassButtonIconProps) {
  const { style, ..._glassViewProps } = glassViewProps;
  const themeTintColor = useThemeColor("background");
  const tintColor = tintColorProp ?? themeTintColor;

  return (
    <Pressable className={cn("relative", size, className)} {...props}>
      <GlassView
        glassEffectStyle="regular"
        isInteractive
        style={[
          {
            ...StyleSheet.absoluteFillObject,
            borderRadius: 999,
            justifyContent: "center",
            alignItems: "center",
            borderCurve: "continuous",
          } satisfies ViewStyle,
          style,
        ]}
        tintColor={tintColor}
        {..._glassViewProps}
      >
        {children}
      </GlassView>
    </Pressable>
  );
}

type GlassCloseButtonProps = Omit<GlassButtonIconProps, "children"> & {
  iconSize?: number;
};

/**
 * Convenience component: a glass button with a close (X) icon.
 * Dismisses the current modal/screen when pressed.
 */
export function GlassCloseButton({
  iconSize = 24,
  onPress,
  ...props
}: GlassCloseButtonProps) {
  const iconColor = useThemeColor("muted-foreground");
  const tintColor = useThemeColor("muted");

  const handlePress: GlassButtonIconProps["onPress"] = (event) => {
    if (onPress) {
      onPress(event);
    } else if (router.canDismiss()) {
      router.dismiss();
    } else {
      router.back();
    }
  };

  return (
    <GlassButtonIcon tintColor={tintColor} {...props} onPress={handlePress}>
      <Cross color={iconColor} size={iconSize} />
    </GlassButtonIcon>
  );
}
