import * as Haptics from "expo-haptics";
import { useCallback } from "react";
import type { PressableProps } from "react-native";
import GlassButton from "@/components/glass-button";
import { useThemeColor } from "@/components/theme-provider";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { StyledLeanText } from "@/config/interop";

type SaveButtonProps = Omit<PressableProps, "children"> & {
  loading?: boolean;
};

export function SaveButton({
  disabled,
  loading,
  onPress,
  ...props
}: SaveButtonProps) {
  const enabledTintColor = useThemeColor("foreground");
  const disabledTintColor = useThemeColor("muted");
  const backgroundColor = useThemeColor("background");
  const disabledTextColor = useThemeColor("foreground-muted");

  const tintColor = disabled ? disabledTintColor : enabledTintColor;
  const textColor = disabled ? disabledTextColor : backgroundColor;
  const iconColor = disabled ? disabledTextColor : backgroundColor;

  const handlePress = useCallback(
    (e: Parameters<NonNullable<PressableProps["onPress"]>>[0]) => {
      if (disabled || loading) return;
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      onPress?.(e);
    },
    [disabled, loading, onPress]
  );

  return (
    <GlassButton
      disabled={disabled || loading}
      glassViewProps={{
        style: {
          borderRadius: 99,
          paddingVertical: 16,
          opacity: disabled ? 0.5 : 1,
        },
      }}
      onPress={handlePress}
      size="lg"
      tintColor={tintColor}
      variant="default"
      {...props}
    >
      {loading ? (
        <IconSymbol color={iconColor} name="hourglass" size={18} />
      ) : (
        <StyledLeanText
          className="font-satoshi-medium text-base"
          style={{ color: textColor }}
        >
          Save
        </StyledLeanText>
      )}
    </GlassButton>
  );
}
