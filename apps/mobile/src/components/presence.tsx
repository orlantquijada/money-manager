import { View } from "@alloc/moti";
import type { ComponentProps } from "react";

// https://twitter.com/FernandoTheRojo/status/1520186163339968514

type MotiViewProps = ComponentProps<typeof View>;

const DELAY = 80;

type Props = {
  delayMultiplier?: number;
  delay?: number;
  exitDelayMultiplier?: number;
} & MotiViewProps;

export default function Presence({
  children,
  delayMultiplier = 0,
  delay = DELAY,
  exitDelayMultiplier = 1,
  ...props
}: Props) {
  return (
    <View
      animate={{
        opacity: 1,
        translateY: 0,
      }}
      exit={{
        opacity: 0,
        translateY: 0,
      }}
      exitTransition={{
        delay: exitDelayMultiplier ? delay * exitDelayMultiplier : 0,
      }}
      from={{
        // FadeInDown initial values
        opacity: 0,
        translateY: 25,
      }}
      transition={{ delay: delay * delayMultiplier }}
      {...props}
    >
      {children}
    </View>
  );
}
