import type { PropsWithChildren } from "react";
import { ActivityIndicator } from "react-native";
import { useReanimatedKeyboardAnimation } from "react-native-keyboard-controller";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StyledLeanView } from "@/config/interop";
import { ChevronLeft, ChevronRight } from "@/icons";
import GlassButtonIcon from "../glass-button-icon";
import { useThemeColor } from "../theme-provider";

type Props = {
  disabled?: boolean;
  loading?: boolean;
  onBackPress?: () => void;
  onContinuePress?: () => void;
  hideBackButton?: boolean;
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
}: PropsWithChildren<Props>) {
  const insets = useSafeAreaInsets();
  const { height: keyboardHeight } = useReanimatedKeyboardAnimation();
  const backgroundColor = useThemeColor("background");
  const tintColor = useThemeColor("foreground");
  const disabledTintColor = useThemeColor("muted");
  const disabledIconColor = useThemeColor("muted-foreground");

  const isContinueBtnDisabled = disabled || loading;

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: keyboardHeight.value }],
  }));

  return (
    <Animated.View
      className="absolute inset-x-0 bottom-0 flex-row items-center justify-between px-4"
      style={[{ paddingBottom: Math.max(insets.bottom, 16) }, animatedStyle]}
    >
      <BackButton hideBackButton={hideBackButton} onBackPress={onBackPress} />

      <StyledLeanView className="relative ml-auto items-center justify-center">
        <GlassButtonIcon
          disabled={isContinueBtnDisabled}
          onPress={onContinuePress}
          tintColor={isContinueBtnDisabled ? disabledTintColor : tintColor}
        >
          {loading ? (
            <ActivityIndicator color={backgroundColor} size="small" />
          ) : (
            <ChevronRight
              color={
                isContinueBtnDisabled ? disabledIconColor : backgroundColor
              }
              size={24}
            />
          )}
        </GlassButtonIcon>
      </StyledLeanView>
    </Animated.View>
  );
}
