import { type ComponentProps } from "react"
import { View, ActivityIndicator } from "react-native"
import clsx from "clsx"
import { MotiView } from "moti"

import { mauveDark } from "~/utils/colors"

type Props = {
  disabled?: boolean
  loading?: boolean
  loadingColor?: string
} & ComponentProps<typeof MotiView>

// only a UI comp does not actually do what a button does
// wrap this with a <Pressable /> to have button functionality
export default function Button(props: Props) {
  const {
    children,
    disabled = false,
    loading = false,
    loadingColor = mauveDark.mauve1,
    transition,
    animate,
    ...rest
  } = props
  return (
    <MotiView
      className="relative h-8 items-center justify-center rounded-xl px-4 transition-colors"
      animate={{
        backgroundColor: disabled ? mauveDark.mauve11 : mauveDark.mauve12,
        ...animate,
      }}
      transition={{
        backgroundColor: { type: "timing", duration: 200 },
        ...transition,
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
    </MotiView>
  )
}
