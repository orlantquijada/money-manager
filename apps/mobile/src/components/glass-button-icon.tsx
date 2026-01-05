import { mauve } from "@radix-ui/colors";
import { GlassView, type GlassViewProps } from "expo-glass-effect";
import type { ReactNode } from "react";
import { Pressable, type PressableProps, StyleSheet } from "react-native";
import { cn } from "@/utils/cn";

type Props = PressableProps & {
  glassViewProps?: GlassViewProps;
  children?: ReactNode;
};

export default function GlassButtonIcon({
  className,
  children,
  glassViewProps = {},
  ...props
}: Props) {
  const { style, ..._glassViewProps } = glassViewProps;

  return (
    <Pressable className={cn("relative size-12", className)} {...props}>
      <GlassView
        glassEffectStyle="regular"
        isInteractive
        style={[
          {
            ...StyleSheet.absoluteFillObject,
            borderRadius: 999,
            justifyContent: "center",
            alignItems: "center",
            borderCurve: "circular",
          },
          style,
        ]}
        tintColor={mauve.mauve1}
        {..._glassViewProps}
      >
        {children}
      </GlassView>
    </Pressable>
  );
}
