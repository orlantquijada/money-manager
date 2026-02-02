import type { PropsWithChildren } from "react";
import { ActivityIndicator } from "react-native";
import { useReanimatedKeyboardAnimation } from "react-native-keyboard-controller";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StyledLeanText, StyledLeanView } from "@/config/interop";
import { StyledGlassButton } from "@/config/interop-glass-button";
import { Check, ChevronLeft, ChevronRight } from "@/icons";

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
  if (hideBackButton) return null;

  return (
    <StyledGlassButton
      onPress={onBackPress}
      tintColorClassName="accent-muted"
      variant="icon"
    >
      <ChevronLeft className="text-muted-foreground" size={24} />
    </StyledGlassButton>
  );
}

function ButtonContent({
  loading,
  variant,
  isFinalAction,
  disabled,
  children,
}: PropsWithChildren<
  Pick<Props, "loading" | "variant" | "isFinalAction" | "disabled">
>) {
  const colorClassName = disabled ? "text-muted-foreground" : "text-background";

  if (loading) {
    return (
      <ActivityIndicator colorClassName="accent-foreground" size="small" />
    );
  }

  if (variant === "text") {
    return (
      <StyledLeanText
        className={`font-satoshi-medium text-sm ${colorClassName}`}
      >
        {children}
      </StyledLeanText>
    );
  }

  return isFinalAction ? (
    <Check className={colorClassName} size={24} />
  ) : (
    <ChevronRight className={colorClassName} size={24} />
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

  const isDisabled = disabled || loading;

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: keyboardHeight.value }],
  }));

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
        <StyledGlassButton
          disabled={isDisabled}
          intent={isDisabled ? "secondary" : "primary"}
          onPress={onContinuePress}
          tintColorClassName={isDisabled ? "accent-muted" : "accent-foreground"}
          variant={buttonVariant}
        >
          <ButtonContent
            disabled={isDisabled}
            isFinalAction={isFinalAction}
            loading={loading}
            variant={variant}
          >
            {children}
          </ButtonContent>
        </StyledGlassButton>
      </StyledLeanView>
    </Animated.View>
  );
}
