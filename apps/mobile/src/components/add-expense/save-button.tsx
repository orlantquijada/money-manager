import * as Haptics from "expo-haptics";
import { useCallback } from "react";
import { ActivityIndicator, type PressableProps } from "react-native";
import { StyledLeanText } from "@/config/interop";
import { StyledGlassButton } from "@/config/interop-glass-button";

type SaveButtonProps = Omit<PressableProps, "children"> & {
  loading?: boolean;
};

export function SaveButton({
  disabled,
  loading,
  onPress,
  ...props
}: SaveButtonProps) {
  const foregroundColorClassName = disabled
    ? "text-muted-foreground"
    : "text-background";

  const handlePress = useCallback(
    (e: Parameters<NonNullable<PressableProps["onPress"]>>[0]) => {
      if (disabled || loading) return;
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      onPress?.(e);
    },
    [disabled, loading, onPress]
  );

  return (
    <StyledGlassButton
      disabled={disabled || loading}
      glassViewProps={{
        style: {
          opacity: disabled ? 0.5 : 1,
          minWidth: 88,
        },
      }}
      intent={disabled ? "secondary" : "primary"}
      onPress={handlePress}
      size="xl"
      tintColorClassName={disabled ? "accent-muted" : "accent-foreground"}
      {...props}
    >
      {loading ? (
        <ActivityIndicator className={foregroundColorClassName} size={24} />
      ) : (
        <StyledLeanText
          className={`font-satoshi-medium text-base ${foregroundColorClassName}`}
        >
          Add
        </StyledLeanText>
      )}
    </StyledGlassButton>
  );
}
