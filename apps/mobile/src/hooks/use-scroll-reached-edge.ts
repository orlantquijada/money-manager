import { useCallback, useEffect, useRef } from "react";
import type { NativeScrollEvent, NativeSyntheticEvent } from "react-native";

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

export function useScrollReachedEdge({
  onEndReached,
  endOffset = DEFAULT_END_OFFSET,
  onStartReached,
  startOffset = DEFAULT_START_OFFSET,
  orientation = "vertical",
  initialEndReached = false,
  initialStartReached = true,
}: Partial<UseScrollEdgeListenersOpts> = {}) {
  // Track edge state without Reanimated (avoids .get()/.set() during scroll)
  const isEndReachedRef = useRef(initialEndReached);
  const isStartReachedRef = useRef(initialStartReached);

  // Keep latest callbacks without changing the scroll handler identity
  const onEndReachedRef = useRef<ToggleCallback | undefined>(onEndReached);
  const onStartReachedRef = useRef<ToggleCallback | undefined>(onStartReached);

  useEffect(() => {
    onEndReachedRef.current = onEndReached;
  }, [onEndReached]);

  useEffect(() => {
    onStartReachedRef.current = onStartReached;
  }, [onStartReached]);

  const axis = orientation === "vertical" ? "y" : "x";
  const dimension = orientation === "vertical" ? "height" : "width";

  const handleScroll = useCallback(
    // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: legacy complexity
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const { layoutMeasurement, contentOffset, contentSize } =
        event.nativeEvent;

      const scrollPosition = contentOffset?.[axis] ?? 0;
      const viewportLength = layoutMeasurement?.[dimension] ?? 0;
      const contentLength = contentSize?.[dimension] ?? 0;

      // START edge
      const startCb = onStartReachedRef.current;
      if (startCb) {
        const reachedStart = scrollPosition <= startOffset;

        if (reachedStart !== isStartReachedRef.current) {
          isStartReachedRef.current = reachedStart;
          (reachedStart ? startCb.on : startCb.off)?.();
        }
      }

      // END edge
      const endCb = onEndReachedRef.current;
      if (endCb) {
        // If content fits in viewport, consider "end reached" (hides fade)
        const reachedEnd =
          contentLength <= viewportLength ||
          viewportLength + scrollPosition >= contentLength - endOffset;

        if (reachedEnd !== isEndReachedRef.current) {
          isEndReachedRef.current = reachedEnd;
          (reachedEnd ? endCb.on : endCb.off)?.();
        }
      }
    },
    [axis, dimension, startOffset, endOffset]
  );

  return handleScroll;
}
