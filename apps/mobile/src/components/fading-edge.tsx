import { type ReactNode, useMemo } from "react";
import {
  I18nManager,
  type StyleProp,
  View,
  type ViewStyle,
} from "react-native";
import { easeGradient } from "react-native-easing-gradient";
import {
  Reanimated3DefaultSpringConfig,
  useSharedValue,
  type WithSpringConfig,
  withSpring,
} from "react-native-reanimated";
import { leftToRight, topToBottom } from "@/constants/linear-gradient";
import { useScrollReachedEdge } from "@/hooks/use-scroll-reached-edge";
import { cn } from "@/utils/cn";

import AnimatedLinearGradient, {
  type AnimatedLinearGradientProps,
} from "./animated-linear-gradient";

type Orientation = "horizontal" | "vertical";

type EdgeValues<T> = T | { start?: T; end?: T };

type GradientStyle = AnimatedLinearGradientProps["style"];

function isEdgeValuesObject<T>(
  value: EdgeValues<T>
): value is { start?: T; end?: T } {
  return (
    typeof value === "object" &&
    value !== null &&
    ("start" in value || "end" in value)
  );
}

function getStartValue<T>(value: EdgeValues<T> | undefined, fallback: T): T {
  if (value === undefined) {
    return fallback;
  }
  if (isEdgeValuesObject(value)) {
    return value.start ?? fallback;
  }
  return value as T;
}

function getEndValue<T>(value: EdgeValues<T> | undefined, fallback: T): T {
  if (value === undefined) {
    return fallback;
  }
  if (isEdgeValuesObject(value)) {
    return value.end ?? fallback;
  }
  return value as T;
}

type FadingEdgeProps = {
  children?: ReactNode;
  fadeColor: string;
  fadeSize?: EdgeValues<number>;
  className?: string;
  orientation?: Orientation;
  showStart?: boolean;
  showEnd?: boolean;
  startStyle?: GradientStyle;
  endStyle?: GradientStyle;
  enabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

export default function FadingEdge({
  children,
  fadeColor,
  fadeSize = 40,
  className,
  orientation = "vertical",
  showStart = true,
  showEnd = true,
  startStyle,
  endStyle,
  enabled = true,
  style,
}: FadingEdgeProps) {
  const isVertical = orientation === "vertical";
  const pointConfig = isVertical ? topToBottom : leftToRight;

  const startFadeSize = getStartValue(fadeSize, 40);
  const endFadeSize = getEndValue(fadeSize, 40);

  const startFadeStyleConfig = useMemo(
    () =>
      isVertical
        ? { left: 0, right: 0, top: 0, height: startFadeSize }
        : {
            top: 0,
            bottom: 0,
            width: startFadeSize,
            ...(I18nManager.isRTL ? { right: 0 } : { left: 0 }),
          },
    [isVertical, startFadeSize]
  );

  const endFadeStyleConfig = useMemo(
    () =>
      isVertical
        ? { left: 0, right: 0, bottom: 0, height: endFadeSize }
        : {
            top: 0,
            bottom: 0,
            width: endFadeSize,
            ...(I18nManager.isRTL ? { left: 0 } : { right: 0 }),
          },
    [isVertical, endFadeSize]
  );

  const startGradient = useMemo(
    () =>
      easeGradient({
        colorStops: {
          0: { color: fadeColor },
          1: { color: "transparent" },
        },
      }) as unknown as Pick<
        AnimatedLinearGradientProps,
        "colors" | "locations"
      >,
    [fadeColor]
  );

  const endGradient = useMemo(
    () =>
      easeGradient({
        colorStops: {
          0: { color: "transparent" },
          1: { color: fadeColor },
        },
      }) as unknown as Pick<
        AnimatedLinearGradientProps,
        "colors" | "locations"
      >,
    [fadeColor]
  );

  const shouldShowStart = enabled && showStart;
  const shouldShowEnd = enabled && showEnd;

  return (
    <View className={cn("relative flex-1", className)} style={style}>
      {children}

      {shouldShowStart && (
        <AnimatedLinearGradient
          colors={startGradient.colors}
          end={pointConfig.end}
          locations={startGradient.locations}
          pointerEvents="none"
          start={pointConfig.start}
          style={[{ position: "absolute" }, startFadeStyleConfig, startStyle]}
        />
      )}

      {shouldShowEnd && (
        <AnimatedLinearGradient
          colors={endGradient.colors}
          end={pointConfig.end}
          locations={endGradient.locations}
          pointerEvents="none"
          start={pointConfig.start}
          style={[{ position: "absolute" }, endFadeStyleConfig, endStyle]}
        />
      )}
    </View>
  );
}

const DEFAULT_SPRING_CONFIG: WithSpringConfig = {
  damping: 15,
  stiffness: 150,
  mass: Reanimated3DefaultSpringConfig.mass,
};

type UseOverflowFadeEdgeOptions = {
  initialOpacity?: EdgeValues<number>;
  orientation?: Orientation;
  offset?: EdgeValues<number>;
  springConfig?: WithSpringConfig;
};

type UseOverflowFadeEdgeReturn = {
  fadeProps: {
    startStyle: { opacity: ReturnType<typeof useSharedValue<number>> };
    endStyle: { opacity: ReturnType<typeof useSharedValue<number>> };
  };
  handleScroll: ReturnType<typeof useScrollReachedEdge>;
  startOpacity: ReturnType<typeof useSharedValue<number>>;
  endOpacity: ReturnType<typeof useSharedValue<number>>;
};

/**
 * A hook that manages animated opacity for FadingEdge based on scroll position.
 * When the user scrolls to the start/end of content, the corresponding fade
 * will animate to transparent (since there's nothing more to scroll).
 *
 * @example
 * ```tsx
 * function ScrollableList() {
 *   const { fadeProps, handleScroll } = useOverflowFadeEdge();
 *
 *   return (
 *     <FadingEdge fadeColor="#000000" {...fadeProps}>
 *       <ScrollView onScroll={handleScroll} scrollEventThrottle={16}>
 *         {items.map(item => <Item key={item.id} {...item} />)}
 *       </ScrollView>
 *     </FadingEdge>
 *   );
 * }
 *
 * // With custom spring animation
 * const { fadeProps, handleScroll } = useOverflowFadeEdge({
 *   springConfig: { damping: 20, stiffness: 200 },
 *   offset: { start: 20, end: 100 },
 * });
 * ```
 */
export function useOverflowFadeEdge({
  initialOpacity,
  orientation = "vertical",
  offset,
  springConfig = DEFAULT_SPRING_CONFIG,
}: UseOverflowFadeEdgeOptions = {}): UseOverflowFadeEdgeReturn {
  const initialStartOpacity = getStartValue(initialOpacity, 0);
  const initialEndOpacity = getEndValue(initialOpacity, 1);

  const startOpacity = useSharedValue(initialStartOpacity);
  const endOpacity = useSharedValue(initialEndOpacity);

  const startOffset = getStartValue(offset, undefined);
  const endOffset = getEndValue(offset, undefined);

  const handleScroll = useScrollReachedEdge({
    onStartReached: {
      on: () => {
        startOpacity.value = withSpring(0, springConfig);
      },
      off: () => {
        startOpacity.value = withSpring(1, springConfig);
      },
    },
    onEndReached: {
      on: () => {
        endOpacity.value = withSpring(0, springConfig);
      },
      off: () => {
        endOpacity.value = withSpring(1, springConfig);
      },
    },
    orientation,
    endOffset,
    startOffset,
  });

  return {
    fadeProps: {
      startStyle: { opacity: startOpacity },
      endStyle: { opacity: endOpacity },
    },
    handleScroll,
    startOpacity,
    endOpacity,
  };
}
