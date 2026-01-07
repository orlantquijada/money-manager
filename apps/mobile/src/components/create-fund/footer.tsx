import type { PropsWithChildren } from "react";
import { ActivityIndicator, View } from "react-native";
import { useReanimatedKeyboardAnimation } from "react-native-keyboard-controller";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StyledLeanText, StyledLeanView } from "@/config/interop";
import { Check, ChevronLeft, ChevronRight } from "@/icons";
import GlassButtonIcon from "../glass-button-icon";
import { useThemeColor } from "../theme-provider";

type ButtonVariant = "text" | "text-check" | "icon-only";

type Props = {
  disabled?: boolean;
  loading?: boolean;
  onBackPress?: () => void;
  onContinuePress?: () => void;
  hideBackButton?: boolean;
  /**
   * Button style variant:
   * - "text": Text label only (e.g., "Save Folder")
   * - "text-check": Text label with checkmark icon
   * - "icon-only": Checkmark for final actions, chevron for continue steps
   */
  variant?: ButtonVariant;
  /**
   * Whether this is a final action (Save, Create, etc.)
   * When true and variant is "icon-only", shows checkmark instead of chevron
   */
  isFinalAction?: boolean;
};

function BackButton({
  hideBackButton,
  onBackPress,
}: Pick<Props, "hideBackButton" | "onBackPress">) {
  const iconColor = useThemeColor("muted-foreground");
  const tintColor = useThemeColor("muted");

  if (hideBackButton) return null;

  return (
    <GlassButtonIcon onPress={onBackPress} tintColor={tintColor}>
      <ChevronLeft color={iconColor} size={24} />
    </GlassButtonIcon>
  );
}

export default function CreateFooter({
  disabled = false,
  loading = false,
  hideBackButton = false,
  onBackPress,
  onContinuePress,
  children,
  variant = "icon-only",
  isFinalAction = false,
}: PropsWithChildren<Props>) {
  const insets = useSafeAreaInsets();
  const { height: keyboardHeight } = useReanimatedKeyboardAnimation();
  const backgroundColor = useThemeColor("background");
  const tintColor = useThemeColor("foreground");
  const disabledTintColor = useThemeColor("muted");
  const disabledIconColor = useThemeColor("muted-foreground");

  const isDisabled = disabled || loading;
  const currentIconColor = isDisabled ? disabledIconColor : backgroundColor;
  const currentTintColor = isDisabled ? disabledTintColor : tintColor;

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: keyboardHeight.value }],
  }));

  const renderButtonContent = () => {
    if (loading) {
      return <ActivityIndicator color={backgroundColor} size="small" />;
    }

    switch (variant) {
      case "text":
        return (
          <StyledLeanText
            className="font-satoshi-medium text-sm px-3"
            style={{ color: currentIconColor }}
          >
            {children}
          </StyledLeanText>
        );

      case "text-check":
        return (
          <View className="flex-row items-center gap-1 px-2">
            <StyledLeanText
              className="font-satoshi-medium text-sm"
              style={{ color: currentIconColor }}
            >
              {children}
            </StyledLeanText>
            <Check color={currentIconColor} size={18} />
          </View>
        );

      case "icon-only":
        return isFinalAction ? (
          <Check color={currentIconColor} size={24} />
        ) : (
          <ChevronRight color={currentIconColor} size={24} />
        );
    }
  };

  // Use pill shape for text variants, circle for icon-only
  const buttonSize = variant === "icon-only" ? "size-12" : undefined;
  const buttonClassName =
    variant !== "icon-only" ? "rounded-full px-2 py-2" : undefined;

  return (
    <Animated.View
      className="absolute inset-x-0 bottom-0 flex-row items-center justify-between px-4"
      style={[{ paddingBottom: Math.max(insets.bottom, 16) }, animatedStyle]}
    >
      <BackButton hideBackButton={hideBackButton} onBackPress={onBackPress} />

      <StyledLeanView
        className="relative ml-auto items-center justify-center"
        style={isDisabled ? { opacity: 0.5 } : undefined}
      >
        <GlassButtonIcon
          className={buttonClassName}
          disabled={isDisabled}
          onPress={onContinuePress}
          size={buttonSize}
          tintColor={currentTintColor}
        >
          {renderButtonContent()}
        </GlassButtonIcon>
      </StyledLeanView>
    </Animated.View>
  );
}
