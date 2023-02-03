import { View } from "react-native"
import { MotiView, useDynamicAnimation } from "moti"
import { useDerivedValue, useSharedValue } from "react-native-reanimated"
import { styled } from "nativewind"
import { ComponentProps, PropsWithChildren } from "react"
import clsx from "clsx"

type Props = PropsWithChildren<
  {
    hide?: boolean
  } & ComponentProps<typeof MotiView>
>

const StyledMotiView = styled(MotiView)
const INITIAL_HEIGHT = 0

export function AnimateHeight(props: Props) {
  const { hide = false, style, className, children, ...rest } = props

  const measuredHeight = useSharedValue(INITIAL_HEIGHT)
  const state = useDynamicAnimation(() => {
    return {
      height: INITIAL_HEIGHT,
      opacity: hide ? 0 : 1,
    }
  })

  useDerivedValue(() => {
    const height = hide ? 0 : Math.ceil(measuredHeight.value)
    const notVisible = !height || hide
    state.animateTo({
      height,
      opacity: notVisible ? 0 : 1,
      scale: notVisible ? 0.9 : 1,
    })
  }, [hide, measuredHeight])

  return (
    <StyledMotiView
      {...rest}
      state={state}
      transition={{
        stiffness: 200,
        damping: 30,
      }}
      className={clsx("overflow-hidden", className)}
      style={style}
    >
      <View
        className="absolute left-0 right-0 bottom-0 top-auto"
        onLayout={({ nativeEvent }) => {
          measuredHeight.value = nativeEvent.layout.height
        }}
      >
        {children}
      </View>
    </StyledMotiView>
  )
}
