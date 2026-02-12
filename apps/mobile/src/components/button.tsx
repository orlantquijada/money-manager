import type { StyleProp, ViewStyle } from "react-native";
import {
  ScalePressable,
  type ScalePressableProps,
} from "@/components/scale-pressable";
import {
  type ButtonSize,
  type ButtonVariant,
  iconSizeClasses,
  paddingBySize,
} from "@/components/ui/button-tokens";
import { cn } from "@/utils/cn";

const INTENT_CLASSES = {
  primary:
    "bg-foreground active:bg-foreground-secondary disabled:bg-foreground-secondary",
  secondary: "bg-muted active:bg-accent-secondary disabled:bg-accent-secondary",
} as const;

type Props = Omit<ScalePressableProps, "style"> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  intent?: "primary" | "secondary";
  style?: StyleProp<ViewStyle>;
};

export default function Button({
  className,
  size = "lg",
  variant = "default",
  intent = "primary",
  disabled,
  style,
  ...props
}: Props) {
  const isIcon = variant === "icon";
  const sizeClass = isIcon ? iconSizeClasses[size] : undefined;

  return (
    <ScalePressable
      {...props}
      className={cn(
        "relative items-center justify-center gap-2 rounded-full android:border-hairline border-border",
        INTENT_CLASSES[intent],
        sizeClass,
        className
      )}
      disabled={disabled}
      style={[
        !isIcon && {
          paddingHorizontal: paddingBySize[size].horizontal,
          paddingVertical: paddingBySize[size].vertical,
        },
        style,
      ]}
    />
  );
}
