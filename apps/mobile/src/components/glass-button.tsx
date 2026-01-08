import { GlassView, type GlassViewProps } from "expo-glass-effect";
import { router } from "expo-router";
import type { SymbolViewProps } from "expo-symbols";
import type { ReactNode } from "react";
import {
  Pressable,
  type PressableProps,
  StyleSheet,
  type ViewStyle,
} from "react-native";
import { useThemeColor } from "@/components/theme-provider";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Cross } from "@/icons";
import { cn } from "@/utils/cn";

type GlassButtonVariant = "icon" | "default";
type GlassButtonSize = "sm" | "md" | "lg" | "xl";

type GlassButtonProps = PressableProps & {
  /**
   * Button variant:
   * - "icon": Circular button for icons (fixed size)
   * - "default": Pill-shaped button that auto-sizes to content
   */
  variant?: GlassButtonVariant;
  /**
   * Size of the button:
   * - For "icon" variant: affects the circle diameter (sm=32, md=40, lg=48)
   * - For "default" variant: affects padding and min-height
   */
  size?: GlassButtonSize;
  glassViewProps?: GlassViewProps;
  children?: ReactNode;
  tintColor?: string;
};

const iconSizeClasses: Record<GlassButtonSize, string> = {
  sm: "size-8",
  md: "size-10",
  lg: "size-12",
  xl: "size-14",
};

const paddingBySize: Record<
  GlassButtonSize,
  { horizontal: number; vertical: number }
> = {
  sm: { horizontal: 12, vertical: 6 },
  md: { horizontal: 16, vertical: 8 },
  lg: { horizontal: 20, vertical: 10 },
  xl: { horizontal: 24, vertical: 12 },
};

export default function GlassButton({
  className,
  children,
  variant = "icon",
  size = "lg",
  glassViewProps = {},
  tintColor: tintColorProp,
  ...props
}: GlassButtonProps) {
  const { style, ..._glassViewProps } = glassViewProps;
  const themeTintColor = useThemeColor("background");
  const tintColor = tintColorProp ?? themeTintColor;

  const isIcon = variant === "icon";
  const sizeClass = isIcon ? iconSizeClasses[size] : undefined;

  return (
    <Pressable className={cn("relative", sizeClass, className)} {...props}>
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
