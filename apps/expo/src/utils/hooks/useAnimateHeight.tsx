import { useCallback } from "react"
import { LayoutChangeEvent } from "react-native"
import {
  SharedValue,
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated"

export function useMeasureHeight(initalHeight = 0) {
  const measuredHeight = useSharedValue(initalHeight)
  const handleOnLayout = useCallback(
    ({ nativeEvent }: LayoutChangeEvent) => {
      measuredHeight.value = nativeEvent.layout.height
    },
    [measuredHeight],
  )

  return { measuredHeight, handleOnLayout } as const
}

export function useMeasureWidth(initalWidth = 0) {
  const measuredWidth = useSharedValue(initalWidth)
  const handleOnLayout = useCallback(
    ({ nativeEvent }: LayoutChangeEvent) => {
      measuredWidth.value = nativeEvent.layout.width
    },
    [measuredWidth],
  )

  return { measuredWidth, handleOnLayout } as const
}

export type UseAnimateProps = {
  defaultOpen?: boolean | undefined
  open?: SharedValue<boolean> | undefined
}

export function useAnimateHeight(
  height: SharedValue<number>,
  { defaultOpen = false, open: openProp }: UseAnimateProps = {},
) {
  const open = useSharedValue(Boolean(defaultOpen))
  const _open = openProp === undefined ? open : openProp

  const animate = useDerivedValue(() =>
    _open.value
      ? {
          height: height.value,
          scale: 1,
          opacity: 1,
        }
      : {
          height: 0,
          scale: 0.9,
          opacity: 0,
        },
  )

  return { animate, open: _open } as const
}
