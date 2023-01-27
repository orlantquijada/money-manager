import clsx from "clsx"
import { ComponentProps } from "react"
import { View } from "react-native"

type Props = {
  disabled?: boolean
} & ComponentProps<typeof View>

// only a UI comp does not actually do what a button does
// wrap this with a <Pressable /> to have button functionality
export default function Button({ className, disabled, ...rest }: Props) {
  return (
    <View
      className={clsx(
        "bg-mauveDark12 h-8 justify-center rounded-xl px-4",
        disabled && "bg-mauveDark11",
        className,
      )}
      {...rest}
    />
  )
}
