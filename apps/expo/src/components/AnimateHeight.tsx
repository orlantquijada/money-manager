import { MotiView } from "moti";
import type { ComponentProps, PropsWithChildren } from "react";
import { View } from "react-native";
import {
  type UseAnimateProps,
  useAnimateHeight,
  useMeasureHeight,
} from "~/utils/hooks/useAnimateHeight";
import { transitions } from "~/utils/motion";

type Props = PropsWithChildren<
  UseAnimateProps & ComponentProps<typeof MotiView> & { initalHeight?: number }
>;

const INITIAL_HEIGHT = 0;

// NOTE: tried using react state to handle `open`
// but the delay while toggling is really noticeable
// and is just bad for UX, especially when the animations are interrupted
export function AnimateHeight(props: Props) {
  const {
    open,
    defaultOpen,
    children,
    initalHeight = INITIAL_HEIGHT,
    ...rest
  } = props;

  const { measuredHeight, handleOnLayout } = useMeasureHeight(initalHeight);
  const { animate } = useAnimateHeight(measuredHeight, { open, defaultOpen });

  return (
    <MotiView
      {...rest}
      animate={animate}
      className="overflow-hidden"
      transition={transitions.snappy}
    >
      <View
        className="absolute top-auto right-0 bottom-0 left-0"
        onLayout={handleOnLayout}
      >
        {children}
      </View>
    </MotiView>
  );
}
