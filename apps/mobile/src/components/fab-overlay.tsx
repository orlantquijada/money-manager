import type { MaterialTopTabBarProps } from "@react-navigation/material-top-tabs";
import { GlassContainer } from "expo-glass-effect";
import { useCallback, useMemo } from "react";
import { Animated } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import GlassButton from "@/components/glass-button";
import { useSyncTabPosition } from "@/hooks/use-sync-tab-position";
import { useTabChangeHaptics } from "@/hooks/use-tab-change-haptics";
import { Plus } from "@/icons";
import { useThemeColor } from "./theme-provider";

const FAB_SIZE = 64;

/**
 * FAB-only overlay for navigating to add-expense.
 * Rendered as MaterialTopTabs tabBar, slides down when on add-expense screen.
 */
export default function FabOverlay({
  navigation,
  position,
  state,
}: MaterialTopTabBarProps) {
  const insets = useSafeAreaInsets();
  useSyncTabPosition(position, state.routes);
  useTabChangeHaptics(state.index);

  const fabIconColor = useThemeColor("muted-foreground");
  const fabTintColor = useThemeColor("muted");

  // Full input range for translateY (position 0 = add-expense, 1 = main)
  const fullInputRange = useMemo(
    () => state.routes.map((_, i) => i),
    [state.routes]
  );

  const translateY = useMemo(
    () =>
      position.interpolate({
        inputRange: fullInputRange,
        outputRange: fullInputRange.map((i) =>
          i === 0 ? FAB_SIZE + insets.bottom + 16 : 0
        ),
      }),
    [position, fullInputRange, insets.bottom]
  );

  const handleFabPress = useCallback(() => {
    navigation.navigate("add-expense");
  }, [navigation]);

  return (
    <Animated.View
      className="absolute right-4"
      style={{
        bottom: insets.bottom,
        transform: [{ translateY }],
      }}
    >
      <GlassContainer>
        <GlassButton
          onPress={handleFabPress}
          size="xxl"
          tintColor={fabTintColor}
          variant="icon"
        >
          <Plus color={fabIconColor} size={24} />
        </GlassButton>
      </GlassContainer>
    </Animated.View>
  );
}
