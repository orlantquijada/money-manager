import {
  ComponentProps,
  forwardRef,
  useImperativeHandle,
  useState,
} from "react"
import { TextInput as RNTextInput, View, Text } from "react-native"
import { clsx } from "clsx"
import RNCurrencyInput, {
  type CurrencyInputProps,
} from "react-native-currency-input"

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
TextInput.displayName = "TextInput"

type OptionalProps = "value" | "onChangeValue" | "defaultValue"
export type CurrencyInput = { getValue: () => number | null }
export const CurrencyInput = forwardRef<
  CurrencyInput,
  Omit<CurrencyInputProps, OptionalProps> &
    Partial<Pick<CurrencyInputProps, OptionalProps>>
>((props, ref) => {
  const [formattedText, setFormattedText] = useState("")
  const [value, setValue] = useState<number | null>(
    props.defaultValue ? +props.defaultValue : null,
  )

  useImperativeHandle(
    ref,
    () => {
      return {
        getValue() {
          return value
        },
      }
    },
    [value],
  )

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
        ₱ {formattedText}
      </Text>

      <RNCurrencyInput
        delimiter=","
        separator="."
        precision={2}
        minValue={0}
        {...props}
        value={props.value || value}
        onChangeText={setFormattedText}
        onChangeValue={(v) => {
          props.onChangeValue?.(v)
          setValue(v)
        }}
        renderTextInput={(textInputProps) => (
          <RNTextInput
            keyboardType="number-pad"
            placeholder="0.00"
            placeholderTextColor={mauveDark.mauve9}
            cursorColor={"transparent"}
            {...textInputProps}
            className={clsx(
              "font-azeret-mono-regular absolute inset-0 pl-8 text-transparent opacity-0",
              value === null && "opacity-100",
            )}
            style={{ lineHeight: undefined }}
          />
        )}
      />
    </View>
  )
})
CurrencyInput.displayName = "CurrencyInput"

export default TextInput
