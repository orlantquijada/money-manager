import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { useCallback, useState } from "react";
import { Pressable, StyleSheet, useWindowDimensions } from "react-native";
import Animated, {
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  StyledGlassView,
  StyledLeanText,
  StyledLeanView,
} from "@/config/interop";
import { StyledGlassButton } from "@/config/interop-glass-button";
import { FolderClosedDuoCreate, Plus, ShoppingBag, WalletDuo } from "@/icons";
import { transitions } from "@/utils/motion";
import type { IconComponent } from "@/utils/types";
import { ScalePressable } from "./scale-pressable";

type MenuItem = {
  title: string;
  Icon: IconComponent;
  pathname: "/create-fund" | "/create-folder" | "/add-expense";
};

const MENU_ITEMS: MenuItem[] = [
  {
    title: "Transaction",
    Icon: ShoppingBag,
    pathname: "/add-expense",
  },
  {
    title: "Fund",
    Icon: WalletDuo,
    pathname: "/create-fund",
  },
  {
    title: "Folder",
    Icon: FolderClosedDuoCreate,
    pathname: "/create-folder",
  },
];

export function FabMenu() {
  const [isExpanded, setIsExpanded] = useState(false);
  const rotation = useSharedValue(0);
  const opacity = useSharedValue(0);
  const insets = useSafeAreaInsets();
  const screenDimes = useWindowDimensions();

  const closeMenu = useCallback(() => {
    setIsExpanded(false);
    rotation.value = withSpring(0, transitions.snappy);
    opacity.value = withTiming(0, { duration: 150 });
  }, [rotation, opacity]);

  const handlePress = useCallback(() => {
    if (isExpanded) {
      closeMenu();
    } else {
      router.navigate("/add-expense");
    }
  }, [isExpanded, closeMenu]);

  const handleLongPress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsExpanded(true);
    rotation.value = withSpring(135, transitions.snappy);
    opacity.value = withTiming(1, { duration: 200 });
  }, [rotation, opacity]);

  const handleBackdropPress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    closeMenu();
  }, [closeMenu]);

  const handleMenuItemPress = useCallback(
    (pathname: MenuItem["pathname"]) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      closeMenu();
      router.navigate(pathname);
    },
    [closeMenu]
  );

  const iconAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const bottom = insets.bottom + 16;

  return (
    <>
      {/* Dismiss layer */}
      <Animated.View
        className="absolute inset-x-0"
        pointerEvents={isExpanded ? "auto" : "none"}
        style={{ bottom: -bottom, top: -screenDimes.height }}
      >
        <Pressable
          onPress={handleBackdropPress}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>

      {/* Dark overlay */}
      <Animated.View
        className="absolute inset-x-0 bg-background/70"
        pointerEvents="none"
        style={[{ bottom: -bottom, top: -screenDimes.height }, backdropStyle]}
      />

      {isExpanded && (
        <StyledLeanView className="absolute right-4 bottom-0 mb-20 items-end gap-3">
          {MENU_ITEMS.map((item, index) => (
            <Animated.View
              entering={FadeIn.delay((MENU_ITEMS.length - 1 - index) * 50)
                .springify()
                .stiffness(transitions.snappy.stiffness)
                .damping(transitions.snappy.damping)}
              exiting={FadeOut.duration(100)}
              key={item.title}
            >
              <ScalePressable
                onPress={() => handleMenuItemPress(item.pathname)}
                opacityValue={0.75}
              >
                <StyledLeanView className="flex-row items-center gap-2">
                  <StyledLeanText className="font-satoshi-medium text-base text-foreground">
                    {item.title}
                  </StyledLeanText>
                  <StyledGlassView
                    className="size-14 items-center justify-center rounded-full android:border-hairline border-border android:bg-muted"
                    isInteractive
                  >
                    <item.Icon className="text-foreground" size={20} />
                  </StyledGlassView>
                </StyledLeanView>
              </ScalePressable>
            </Animated.View>
          ))}
        </StyledLeanView>
      )}

      <StyledGlassButton
        intent={isExpanded ? "primary" : "secondary"}
        onLongPress={handleLongPress}
        onPress={handlePress}
        scaleValue={0.9}
        size="xl"
        tintColorClassName={
          isExpanded ? "accent-foreground" : "accent-background"
        }
        variant="icon"
      >
        <Animated.View style={iconAnimatedStyle}>
          <Plus
            className={isExpanded ? "text-background" : "text-foreground"}
            size={24}
          />
        </Animated.View>
      </StyledGlassButton>
    </>
  );
}
