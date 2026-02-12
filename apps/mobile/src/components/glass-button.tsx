import type { GlassViewProps } from "expo-glass-effect";
import type { ReactNode } from "react";
import type { PressableProps, ViewStyle } from "react-native";

import Button from "@/components/button";
import type { ScalePressableProps } from "@/components/scale-pressable";
import type {
  ButtonIntent,
  ButtonSize,
  ButtonVariant,
} from "@/components/ui/button-tokens";

export type GlassButtonProps = PressableProps &
  Pick<
    ScalePressableProps,
    "scaleValue" | "opacityValue" | "disableScale" | "disableOpacity"
  > & {
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
  scaleValue,
  opacityValue,
  disableScale,
  disableOpacity,
  ...props
}: GlassButtonProps) {
  return (
    <Button
      className={className}
      disableOpacity={disableOpacity}
      disableScale={disableScale}
      intent={intent}
      opacityValue={opacityValue}
      scaleValue={scaleValue}
      size={size}
      style={style as ViewStyle}
      variant={variant}
      {...props}
    >
      {children}
    </Button>
  );
}
