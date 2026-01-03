import type { ReactNode } from "react";
import { useMemo } from "react";
import { Animated } from "react-native";
import { useTabPosition } from "@/contexts/tab-position-context";

type AnimatedTabScreenProps = {
  children: ReactNode;
  index: number;
};

export function AnimatedTabScreen({ children, index }: AnimatedTabScreenProps) {
  const { position } = useTabPosition();

  const scale = useMemo(() => {
    if (!position) return 1;

    return position.interpolate({
      inputRange: [index - 1, index, index + 1],
      outputRange: [0.9, 1, 0.9],
      extrapolate: "clamp",
    });
  }, [position, index]);

  const borderRadius = useMemo(() => {
    if (!position) return 0;

    return position.interpolate({
      inputRange: [index - 1, index, index + 1],
      outputRange: [32, 0, 32],
      extrapolate: "clamp",
    });
  }, [position, index]);

  if (!position) {
    return <>{children}</>;
  }

  return (
    <Animated.View
      className="flex-1 overflow-hidden"
      style={[{ transform: [{ scale }], borderRadius }]}
    >
      {children}
    </Animated.View>
  );
}
