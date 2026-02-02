import type { TabTriggerSlotProps } from "expo-router/ui";
import { useEffect, useRef } from "react";
import { Animated, Platform } from "react-native";
import { cn } from "@/utils/cn";
import type { TabBarIconProps } from "@/utils/types";
import { ScalePressable } from "./scale-pressable";

type TabButtonProps = TabTriggerSlotProps & {
  icon: (props: TabBarIconProps) => React.ReactNode;
  size?: number;
};

export default function TabButton({
  icon: Icon,
  size = 24,
  isFocused,
  className,
  ...props
}: TabButtonProps) {
  const fillOpacity = useRef(new Animated.Value(isFocused ? 1 : 0)).current;
  const outlineOpacity = useRef(new Animated.Value(isFocused ? 0 : 1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fillOpacity, {
        toValue: isFocused ? 1 : 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(outlineOpacity, {
        toValue: isFocused ? 0 : 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [isFocused, fillOpacity, outlineOpacity]);

  return (
    <ScalePressable
      className={cn(
        "items-center justify-center rounded-full px-8",
        isFocused && "android:bg-background bg-muted",
        className
      )}
      opacityValue={0.7}
      scaleValue={Platform.select({ ios: 1.2, android: 0.9 })}
      {...props}
    >
      <Icon
        className="text-foreground"
        fillOpacity={fillOpacity}
        outlineOpacity={outlineOpacity}
        size={size}
      />
    </ScalePressable>
  );
}
