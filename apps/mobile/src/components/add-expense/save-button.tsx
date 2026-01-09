import * as Haptics from "expo-haptics";
import { useCallback } from "react";
import { ActivityIndicator, type PressableProps } from "react-native";
import GlassButton from "@/components/glass-button";
import { useThemeColor } from "@/components/theme-provider";
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
  const disabledTextColor = useThemeColor("muted-foreground");

  const tintColor = disabled ? disabledTintColor : enabledTintColor;
  const foregroundColor = disabled ? disabledTextColor : backgroundColor;

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
          opacity: disabled ? 0.5 : 1,
          minWidth: 88,
        },
      }}
      onPress={handlePress}
      size="xl"
      tintColor={tintColor}
      variant="default"
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={foregroundColor} size={24} />
      ) : (
        <StyledLeanText
          className="font-satoshi-medium text-base"
          style={{ color: foregroundColor }}
        >
          Add
        </StyledLeanText>
      )}
    </GlassButton>
  );
}
