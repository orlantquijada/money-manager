import type { PropsWithChildren } from "react";
import { ActivityIndicator } from "react-native";
import { ScalePressable } from "@/components/scale-pressable";
import { StyledLeanText, StyledLeanView } from "@/config/interop";
import { cn } from "@/utils/cn";
import Button from "../button";
import { useThemeColor } from "../theme-provider";

type Props = {
  disabled?: boolean;
  loading?: boolean;
  onBackPress?: () => void;
  onContinuePress?: () => void;
  hideBackButton?: boolean;
};

export const FOOTER_HEIGHT = 64;

export default function CreateFooter({
  disabled = false,
  loading = false,
  hideBackButton = false,
  onBackPress,
  onContinuePress,
  children,
}: PropsWithChildren<Props>) {
  const activityIndicatorColor = useThemeColor("background");

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
        className="ml-auto min-w-20"
        disabled={disabled || loading}
        hitSlop={12}
        onPress={onContinuePress}
      >
        {loading && (
          <ActivityIndicator
            className="absolute"
            color={activityIndicatorColor}
            size="small"
          />
        )}

        <StyledLeanText
          className={cn(
            "font-satoshi-medium text-background text-sm",
            loading && "opacity-0"
          )}
        >
          {children}
        </StyledLeanText>
      </Button>
    </StyledLeanView>
  );
}
