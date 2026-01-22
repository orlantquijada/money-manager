import { router } from "expo-router";
import type { ReactNode } from "react";
import type { PressableProps, ViewStyle } from "react-native";

import Button from "@/components/button";
import { useThemeColor } from "@/components/theme-provider";
import type { ButtonSize, ButtonVariant } from "@/components/ui/button-tokens";
import type { IconSymbolName } from "@/components/ui/icon-symbol";
import { StyledIconSymbol } from "@/config/interop";
import { Cross } from "@/icons";

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
  glassViewProps?: Record<string, unknown>; // Ignored on Android
  children?: ReactNode;
  tintColor?: string | null;
};

export default function GlassButton({
  className,
  children,
  variant = "default",
  size = "lg",
  tintColor: tintColorProp,
  style: styleProp,
  ...props
}: GlassButtonProps) {
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
  icon: IconSymbolName;
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

  return (
    <GlassButton
      onPress={onPress}
      size={size}
      tintColor={tintColor}
      variant="icon"
      {...props}
    >
      <StyledIconSymbol
        colorClassName="accent-muted-foreground"
        name={icon}
        size={iconSize}
      />
    </GlassButton>
  );
}
