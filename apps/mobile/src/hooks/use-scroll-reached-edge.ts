import { useCallback } from "react";
import type { NativeScrollEvent, NativeSyntheticEvent } from "react-native";
import { type SharedValue, useSharedValue } from "react-native-reanimated";

const DEFAULT_END_OFFSET = 50;
const DEFAULT_START_OFFSET = 10;

type ToggleCallback = Partial<{
  on: () => void;
  off: () => void;
}>;

type UseScrollEdgeListenersOpts = {
  onEndReached: ToggleCallback;
  endOffset: number;
  onStartReached: ToggleCallback;
  startOffset: number;
  orientation: "horizontal" | "vertical";
  initialEndReached: boolean;
  initialStartReached: boolean;
};

function handleEdgeToggle(
  reached: boolean,
  state: SharedValue<boolean>,
  callbacks: ToggleCallback
) {
  if (reached && !state.get()) {
    state.set(true);
    callbacks.on?.();
  } else if (!reached && state.get()) {
    state.set(false);
    callbacks.off?.();
  }
}

export function useScrollReachedEdge({
  onEndReached,
  endOffset = DEFAULT_END_OFFSET,
  onStartReached,
  startOffset = DEFAULT_START_OFFSET,
  orientation = "vertical",
  initialEndReached = false,
  initialStartReached = true,
}: Partial<UseScrollEdgeListenersOpts> = {}) {
  const isEndReached = useSharedValue(initialEndReached);
  const isStartReached = useSharedValue(initialStartReached);

  const axis = orientation === "vertical" ? "y" : "x";
  const dimension = orientation === "vertical" ? "height" : "width";

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const { layoutMeasurement, contentOffset, contentSize } =
        event.nativeEvent;

      const scrollPosition = contentOffset[axis];
      const viewportLength = layoutMeasurement[dimension];
      const contentLength = contentSize[dimension];

      if (onEndReached) {
        const reachedEnd =
          viewportLength + scrollPosition >= contentLength - endOffset;
        handleEdgeToggle(reachedEnd, isEndReached, onEndReached);
      }

      if (onStartReached) {
        const reachedStart = scrollPosition <= startOffset;
        handleEdgeToggle(reachedStart, isStartReached, onStartReached);
      }
    },
    [
      onEndReached,
      onStartReached,
      startOffset,
      endOffset,
      axis,
      dimension,
      isEndReached,
      isStartReached,
    ]
  );

  return handleScroll;
}
