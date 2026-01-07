import type { PropsWithChildren } from "react";
import { ActivityIndicator, View } from "react-native";
import { ScalePressable } from "@/components/scale-pressable";
import { StyledLeanText, StyledLeanView } from "@/config/interop";
import { Check, ChevronRight } from "@/icons";
import { cn } from "@/utils/cn";
import Button from "../button";
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
   * - "text": Text label only (default for final actions)
   * - "text-check": Text label with checkmark icon
   * - "icon-only": Checkmark icon for final actions, chevron for continue
   */
  variant?: ButtonVariant;
  /**
   * Whether this is a final/destructive action (e.g., Save, Create)
   * When true and variant is "icon-only", shows checkmark instead of chevron
   */
  isFinalAction?: boolean;
};

export const FOOTER_HEIGHT = 64;

export default function CreateFooter({
  disabled = false,
  loading = false,
  hideBackButton = false,
  onBackPress,
  onContinuePress,
  children,
  variant = "text",
  isFinalAction = false,
}: PropsWithChildren<Props>) {
  const activityIndicatorColor = useThemeColor("background");
  const iconColor = useThemeColor("background");
  const disabledIconColor = useThemeColor("muted-foreground");

  const isDisabled = disabled || loading;

  const renderButtonContent = () => {
    if (loading) {
      return <ActivityIndicator color={activityIndicatorColor} size="small" />;
    }

    const currentIconColor = isDisabled ? disabledIconColor : iconColor;

    switch (variant) {
      case "text":
        return (
          <StyledLeanText
            className={cn(
              "font-satoshi-medium text-background text-sm",
              isDisabled && "opacity-50"
            )}
          >
            {children}
          </StyledLeanText>
        );

      case "text-check":
        return (
          <View className="flex-row items-center gap-1.5">
            <StyledLeanText
              className={cn(
                "font-satoshi-medium text-background text-sm",
                isDisabled && "opacity-50"
              )}
            >
              {children}
            </StyledLeanText>
            <Check color={currentIconColor} size={16} />
          </View>
        );

      case "icon-only":
        return isFinalAction ? (
          <Check color={currentIconColor} size={20} />
        ) : (
          <ChevronRight color={currentIconColor} size={20} />
        );
    }
  };

  return (
    <StyledLeanView
      className="flex flex-row items-center justify-between border-t border-t-border bg-background px-4"
      style={{
        height: FOOTER_HEIGHT,
      }}
    >
      {!hideBackButton && (
        <ScalePressable
          className="h-8 justify-center"
          hitSlop={{ left: 20, right: 20, top: 5, bottom: 5 }}
          onPress={onBackPress}
          opacityValue={0.5}
          scaleValue={0.95}
        >
          <StyledLeanText className="font-satoshi-medium text-foreground text-sm">
            Back
          </StyledLeanText>
        </ScalePressable>
      )}

      <Button
        className={cn(
          "ml-auto",
          variant === "icon-only" ? "min-w-12" : "min-w-20",
          isDisabled && "opacity-50"
        )}
        disabled={isDisabled}
        hitSlop={12}
        onPress={onContinuePress}
      >
        {renderButtonContent()}
      </Button>
    </StyledLeanView>
  );
}
