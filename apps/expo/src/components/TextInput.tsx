import { ComponentProps, forwardRef, useState } from "react"
import { TextInput as RNTextInput, View, Text } from "react-native"
import { clsx } from "clsx"
import RNCurrencyInput from "react-native-currency-input"

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
        style={[{ lineHeight: undefined }, props.style]}
        placeholderTextColor={mauveDark.mauve9}
        cursorColor={mauveDark.mauve12}
        ref={ref}
      />
    )
  },
)

export const CurrencyInput = forwardRef<
  RNTextInput,
  ComponentProps<typeof RNTextInput>
>((props, ref) => {
  return (
    <View
      className={clsx(
        "bg-mauveDark4 relative h-[42px] flex-row items-center justify-start rounded-xl px-4 text-base",
        props.className,
      )}
      style={props.style}
    >
      <Text
        className="font-azeret-mono-regular text-mauveDark12 mr-2"
        style={{ lineHeight: undefined }}
      >
        ₱
      </Text>
      <RNCurrencyInput
        className="font-azeret-mono-regular text-mauveDark12 absolute inset-0 pl-7"
        value={props.value}
        onChangeValue={() => {}}
        delimiter="."
        separator=","
        precision={2}
        minValue={0}
      />

      {/* <RNTextInput */}
      {/*   {...props} */}
      {/*   style={{ lineHeight: undefined }} */}
      {/*   className="font-azeret-mono-regular text-mauveDark12 absolute inset-0 pl-7" */}
      {/*   placeholderTextColor={mauveDark.mauve9} */}
      {/*   cursorColor={mauveDark.mauve12} */}
      {/*   ref={ref} */}
      {/* /> */}
    </View>
  )
})

export default TextInput
