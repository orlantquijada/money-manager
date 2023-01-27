import { ComponentProps, forwardRef } from "react"
import { TextInput as RNTextInput } from "react-native"
import { clsx } from "clsx"
import { mauveDark } from "~/utils/colors"

const TextInput = forwardRef<RNTextInput, ComponentProps<typeof RNTextInput>>(
  (props, ref) => {
    return (
      <RNTextInput
        {...props}
        className={clsx(
          "bg-mauveDark4 font-satoshi text-mauveDark12 h-[42px] items-start justify-center rounded-xl px-4 text-base",
          props.className,
        )}
        placeholderTextColor={mauveDark.mauve9}
        cursorColor={mauveDark.mauve12}
        ref={ref}
      />
    )
  },
)

export default TextInput
