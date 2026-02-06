import * as Haptics from "expo-haptics";
import { useCallback, useRef } from "react";
import type { NativeScrollEvent, NativeSyntheticEvent } from "react-native";
import Animated, {
  type SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { StyledLeanText } from "@/config/interop";
import { StyledGlassButton } from "@/config/interop-glass-button";
import { Plus } from "@/icons";
import { transitions } from "@/utils/motion";

const SCROLL_THRESHOLD = 50;

type Props = {
  label: string;
  onPress: () => void;
};

export function useCollapsibleBarScroll() {
  const isCollapsed = useSharedValue(0);
  const lastScrollY = useRef(0);

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const currentY = event.nativeEvent.contentOffset.y;
    const diff = currentY - lastScrollY.current;

    if (Math.abs(diff) < 5) return;

    if (diff > 0 && currentY > SCROLL_THRESHOLD) {
      isCollapsed.value = withSpring(1, transitions.soft);
    } else if (diff < 0) {
      isCollapsed.value = withSpring(0, transitions.soft);
    }

    lastScrollY.current = currentY;
  };

  return { isCollapsed, onScroll };
}

type CollapsibleActionBarControlledProps = Props & {
  isCollapsed: SharedValue<number>;
};

export function CollapsibleActionBarControlled({
  label,
  onPress,
  isCollapsed,
}: CollapsibleActionBarControlledProps) {
  const handlePress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  }, [onPress]);

  const handleFabPress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    isCollapsed.value = withSpring(0, transitions.soft);
    onPress();
  }, [onPress, isCollapsed]);

  const barStyle = useAnimatedStyle(() => ({
    opacity: 1 - isCollapsed.value,
    transform: [
      { translateY: isCollapsed.value * 100 },
      { scale: 1 - isCollapsed.value * 0.1 },
    ],
    pointerEvents: isCollapsed.value < 0.5 ? "auto" : "none",
  }));

  const fabStyle = useAnimatedStyle(() => ({
    opacity: isCollapsed.value,
    transform: [{ scale: 0.8 + isCollapsed.value * 0.2 }],
    pointerEvents: isCollapsed.value > 0.5 ? "auto" : "none",
  }));

  return (
    <>
      <Animated.View
        className="absolute right-4 bottom-safe-offset-4 left-4"
        style={barStyle}
      >
        <StyledGlassButton
          className="w-full"
          intent="primary"
          onPress={handlePress}
          size="xl"
          tintColorClassName="accent-foreground"
        >
          <StyledLeanText className="font-satoshi-medium text-background">
            {label}
          </StyledLeanText>
        </StyledGlassButton>
      </Animated.View>

      <Animated.View
        className="absolute right-4 bottom-safe-offset-4"
        style={fabStyle}
      >
        <StyledGlassButton
          onPress={handleFabPress}
          size="lg"
          tintColorClassName="accent-muted"
          variant="icon"
        >
          <Plus className="text-muted-foreground" size={24} />
        </StyledGlassButton>
      </Animated.View>
    </>
  );
}
