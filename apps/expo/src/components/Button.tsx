import { type ComponentProps } from "react"
import { View, ActivityIndicator } from "react-native"
import clsx from "clsx"
import { MotiView } from "moti"
import { styled } from "nativewind"

import { mauveDark } from "~/utils/colors"

const StyledMotiView = styled(MotiView)
type Props = {
  disabled?: boolean
  loading?: boolean
  loadingColor?: string
} & ComponentProps<typeof StyledMotiView>

// only a UI comp does not actually do what a button does
// wrap this with a <Pressable /> to have button functionality
export default function Button(props: Props) {
  const {
    className,
    children,
    disabled = false,
    loading = false,
    loadingColor = mauveDark.mauve1,
    ...rest
  } = props
  return (
    <StyledMotiView
      className={clsx(
        "relative h-8 items-center justify-center rounded-xl px-4 transition-colors",
        className,
      )}
      animate={{
        backgroundColor: disabled ? mauveDark.mauve11 : mauveDark.mauve12,
        ...rest.animate,
      }}
      transition={{
        backgroundColor: { type: "timing", duration: 200 },
        ...rest.transition,
      }}
      {...rest}
    >
      <View className={clsx(loading && "opacity-0")}>{children}</View>
      {loading && (
        <ActivityIndicator
          className="absolute"
          size="small"
          color={loadingColor}
        />
      )}
    </StyledMotiView>
  )
}
