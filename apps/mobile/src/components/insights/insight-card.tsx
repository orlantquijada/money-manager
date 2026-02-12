import type { ReactNode } from "react";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { StyledLeanView } from "@/config/interop";
import { cn } from "@/utils/cn";

type Props = {
  children: ReactNode;
  className?: string;
};

export default function InsightCard({ children, className }: Props) {
  return (
    <Animated.View
      entering={FadeIn.duration(300)}
      exiting={FadeOut.duration(200)}
    >
      <StyledLeanView
        className={cn(
          "rounded-2xl border border-border-secondary bg-card p-4",
          className
        )}
        style={{ borderCurve: "continuous" }}
      >
        {children}
      </StyledLeanView>
    </Animated.View>
  );
}
