import { GlassView, type GlassViewProps } from "expo-glass-effect";
import { router } from "expo-router";
import type { SymbolViewProps } from "expo-symbols";
import type { ReactNode } from "react";
import {
  Platform,
  Pressable,
  type PressableProps,
  StyleSheet,
  type ViewStyle,
} from "react-native";

import Button from "@/components/button";
import { useThemeColor } from "@/components/theme-provider";
import {
  type ButtonSize,
  type ButtonVariant,
  iconSizeClasses,
  paddingBySize,
} from "@/components/ui/button-tokens";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Cross } from "@/icons";
import { cn } from "@/utils/cn";

type GlassButtonProps = PressableProps & {
  /**
   * Button variant:
   * - "icon": Circular button for icons (fixed size)
   * - "default": Pill-shaped button that auto-sizes to content
   */
  variant?: ButtonVariant;
  /**
   * Size of the button:
   * - For "icon" variant: affects the circle diameter (sm=32, md=40, lg=48)
   * - For "default" variant: affects padding and min-height
   */
  size?: ButtonSize;
  glassViewProps?: GlassViewProps;
  children?: ReactNode;
  tintColor?: string | null;
};

export default function GlassButton({
  className,
  children,
  variant = "default",
  size = "lg",
  glassViewProps = {},
  tintColor: tintColorProp,
  style: styleProp,
  ...props
}: GlassButtonProps) {
  const themeTintColor = useThemeColor("background");
  const tintColor =
    tintColorProp !== null ? (tintColorProp ?? themeTintColor) : undefined;

  // Android Fallback: Use the "Secondary" (subtle) Button
  if (Platform.OS !== "ios") {
    // Cast style to match Button's expected type (ViewStyle), ignoring the function case for now
    // as GlassButton is rarely used with function styles in this project context.
    // If strict type safety is needed for function styles, Button props would need update.
    return (
      <Button
        className={className}
        intent="secondary"
        size={size}
        style={styleProp as ViewStyle}
        variant={variant}
        {...props}
      >
        {children}
      </Button>
    );
  }

  // iOS Implementation (Glass)
  const { style: glassStyle, ..._glassViewProps } = glassViewProps;

  const isIcon = variant === "icon";
  const sizeClass = isIcon ? iconSizeClasses[size] : undefined;

  return (
    <Pressable
      className={cn("relative", sizeClass, className)}
      style={styleProp}
      {...props}
    >
      <GlassView
        glassEffectStyle="regular"
        isInteractive
        style={[
          {
            ...(isIcon ? StyleSheet.absoluteFillObject : {}),
            borderRadius: 999,
            justifyContent: "center",
            alignItems: "center",
            borderCurve: "continuous",
          } satisfies ViewStyle,
          !isIcon && {
            flexDirection: "row",
            paddingHorizontal: paddingBySize[size].horizontal,
            paddingVertical: paddingBySize[size].vertical,
          },
          glassStyle,
        ]}
        tintColor={tintColor}
        {..._glassViewProps}
      >
        {children}
      </GlassView>
    </Pressable>
  );
}

type GlassCloseButtonProps = Omit<GlassButtonProps, "children" | "variant"> & {
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

  const handlePress: GlassButtonProps["onPress"] = (event) => {
    if (onPress) {
      onPress(event);
    } else if (router.canDismiss()) {
      router.dismiss();
    } else {
      router.back();
    }
  };

  return (
    <GlassButton
      tintColor={tintColor}
      variant="icon"
      {...props}
      onPress={handlePress}
    >
      <Cross color={iconColor} size={iconSize} />
    </GlassButton>
  );
}

type GlassIconButtonProps = Omit<GlassButtonProps, "children" | "variant"> & {
  icon: SymbolViewProps["name"];
  iconSize?: number;
};

/**
 * A glass button with an SF Symbol icon.
 * Uses expo-symbols (SymbolView) for the icon.
 */
export function GlassIconButton({
  icon,
  iconSize = 18,
  onPress,
  size = "md",
  ...props
}: GlassIconButtonProps) {
  const tintColor = useThemeColor("muted");
  const iconColor = useThemeColor("muted-foreground");

  return (
    <GlassButton
      onPress={onPress}
      size={size}
      tintColor={tintColor}
      variant="icon"
      {...props}
    >
      <IconSymbol color={iconColor} name={icon} size={iconSize} />
    </GlassButton>
  );
}
