import type { PropsWithChildren } from "react";
import { ActivityIndicator } from "react-native";
import { useReanimatedKeyboardAnimation } from "react-native-keyboard-controller";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StyledLeanText, StyledLeanView } from "@/config/interop";
import { Check, ChevronLeft, ChevronRight } from "@/icons";
import GlassButton from "../glass-button";
import { useThemeColor } from "../theme-provider";

type ButtonVariant = "text" | "icon-only";

type Props = {
  disabled?: boolean;
  loading?: boolean;
  onBackPress?: () => void;
  onContinuePress?: () => void;
  hideBackButton?: boolean;
  /**
   * Button style variant:
   * - "text": Pill-shaped button with text label (e.g., "Save Folder", "Create Fund")
   * - "icon-only": Circular button with icon (chevron for next steps, checkmark for final actions)
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
    <GlassButton onPress={onBackPress} tintColor={tintColor} variant="icon">
      <ChevronLeft color={iconColor} size={24} />
    </GlassButton>
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
            className="font-satoshi-medium text-sm"
            style={{ color: currentIconColor }}
          >
            {children}
          </StyledLeanText>
        );

      case "icon-only":
        return isFinalAction ? (
          <Check color={currentIconColor} size={24} />
        ) : (
          <ChevronRight color={currentIconColor} size={24} />
        );

      default:
        return null;
    }
  };

  // Determine button variant based on footer variant
  const buttonVariant = variant === "icon-only" ? "icon" : "default";

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
        <GlassButton
          disabled={isDisabled}
          onPress={onContinuePress}
          tintColor={currentTintColor}
          variant={buttonVariant}
        >
          {renderButtonContent()}
        </GlassButton>
      </StyledLeanView>
    </Animated.View>
  );
}
