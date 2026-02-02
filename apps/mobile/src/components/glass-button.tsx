import type { GlassViewProps } from "expo-glass-effect";
import type { ReactNode } from "react";
import type { PressableProps, ViewStyle } from "react-native";

import Button from "@/components/button";
import type {
  ButtonIntent,
  ButtonSize,
  ButtonVariant,
} from "@/components/ui/button-tokens";

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
  intent?: ButtonIntent;
  glassViewProps?: GlassViewProps;
  children?: ReactNode;
  tintColor?: string | null;
};

export default function GlassButton({
  className,
  children,
  variant = "default",
  size = "lg",
  intent = "secondary",
  // iOS-only props - unused in fallback but kept for API compatibility
  glassViewProps: _glassViewProps,
  tintColor: _tintColor,
  style,
  ...props
}: GlassButtonProps) {
  return (
    <Button
      className={className}
      intent={intent}
      size={size}
      style={style as ViewStyle}
      variant={variant}
      {...props}
    >
      {children}
    </Button>
  );
}
