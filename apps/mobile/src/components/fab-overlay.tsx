import type { MaterialTopTabBarProps } from "@react-navigation/material-top-tabs";
import { useCallback, useMemo } from "react";
import { Animated, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import GlassButton from "@/components/glass-button";
import { useSyncTabPosition } from "@/hooks/use-sync-tab-position";
import { useTabChangeHaptics } from "@/hooks/use-tab-change-haptics";
import { Plus } from "@/icons";
import { useThemeColor } from "./theme-provider";

export const FAB_SIZE = 56;
const TAB_BAR_HEIGHT = 48;
const GAP = 16;

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

  const bottom = insets.bottom + TAB_BAR_HEIGHT + GAP;

  const translateY = useMemo(
    () =>
      position.interpolate({
        inputRange: fullInputRange,
        outputRange: fullInputRange.map((i) =>
          i === 0 ? FAB_SIZE + bottom : 0
        ),
      }),
    [position, fullInputRange, bottom]
  );

  const handleFabPress = useCallback(() => {
    navigation.navigate("add-expense");
  }, [navigation]);

  return (
    <Animated.View
      className="absolute right-4"
      style={{
        bottom,
        transform: [{ translateY }],
      }}
    >
      <View>
        <GlassButton
          onPress={handleFabPress}
          size="xl"
          tintColor={fabTintColor}
          variant="icon"
        >
          <Plus color={fabIconColor} size={24} />
        </GlassButton>
      </View>
    </Animated.View>
  );
}
