import { ViewProps } from "react-native"
import {
  SharedValue,
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated"

export function useMeasureHeight(initalHeight = 0) {
  const measuredHeight = useSharedValue(initalHeight)
  const handleOnLayout: ViewProps["onLayout"] = ({ nativeEvent }) => {
    measuredHeight.value = nativeEvent.layout.height
  }

  return { measuredHeight, handleOnLayout } as const
}

export function useAnimateHeight(
  height: SharedValue<number>,
  {
    defaultOpen = false,
    open: openProp,
  }: {
    defaultOpen?: boolean
    open?: SharedValue<boolean>
  } = {},
) {
  const open = useSharedValue(defaultOpen)
  const _open = openProp === undefined ? open : openProp

  const animate = useDerivedValue(() => {
    return _open.value
      ? {
          height: height.value,
          scale: 1,
          opacity: 1,
        }
      : {
          height: 0,
          scale: 0.9,
          opacity: 1,
        }
  })

  return { animate, open: _open } as const
}
