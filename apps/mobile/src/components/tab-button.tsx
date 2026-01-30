import type { TabTriggerSlotProps } from "expo-router/ui";
import { useMemo } from "react";
import { Animated, Platform } from "react-native";
import type { TabBarIconProps } from "@/utils/types";
import { ScalePressable } from "./scale-pressable";
import { useThemeColor } from "./theme-provider";

type TabButtonProps = TabTriggerSlotProps & {
  icon: (props: TabBarIconProps) => React.ReactNode;
  size?: number;
};

export default function TabButton({
  icon: Icon,
  size = 24,
  isFocused,
  ...props
}: TabButtonProps) {
  const iconColor = useThemeColor("foreground");

  const fillOpacity = useMemo(
    () => new Animated.Value(isFocused ? 1 : 0),
    [isFocused]
  );
  const outlineOpacity = useMemo(
    () => new Animated.Value(isFocused ? 0 : 1),
    [isFocused]
  );

  return (
    <ScalePressable
      className="items-center justify-center p-3"
      opacityValue={0.7}
      scaleValue={Platform.select({ ios: 1.2, android: 0.9 })}
      {...props}
    >
      <Icon
        color={iconColor}
        fillOpacity={fillOpacity}
        outlineOpacity={outlineOpacity}
        size={size}
      />
    </ScalePressable>
  );
}
