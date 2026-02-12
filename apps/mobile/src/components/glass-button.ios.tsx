import { GlassView, type GlassViewProps } from "expo-glass-effect";
import type { ReactNode } from "react";
import {
  Pressable,
  type PressableProps,
  StyleSheet,
  type ViewStyle,
} from "react-native";
import { useThemeColor } from "@/components/theme-provider";
import {
  type ButtonIntent,
  type ButtonSize,
  type ButtonVariant,
  iconSizeClasses,
  paddingBySize,
} from "@/components/ui/button-tokens";
import { cn } from "@/utils/cn";

export type GlassButtonProps = PressableProps & {
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
  /** Button intent for API consistency with fallback. Unused on iOS. */
  intent?: ButtonIntent;
  glassViewProps?: GlassViewProps;
  children?: ReactNode;
  tintColor?: string;
};

export default function GlassButton({
  className,
  children,
  variant = "default",
  size = "lg",
  intent: _intent,
  glassViewProps = {},
  tintColor: tintColorProp,
  style: styleProp,
  ...props
}: GlassButtonProps) {
  const themeTintColor = useThemeColor("background");
  const tintColor =
    tintColorProp === null ? undefined : (tintColorProp ?? themeTintColor);

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
