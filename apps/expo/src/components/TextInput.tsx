import { clsx } from "clsx";
import {
  type ComponentProps,
  forwardRef,
  useImperativeHandle,
  useState,
} from "react";
import { TextInput as RNTextInput, Text, View } from "react-native";
import RNCurrencyInput, {
  type CurrencyInputProps,
} from "react-native-currency-input";

import { mauveDark } from "~/utils/colors";

const TextInput = forwardRef<RNTextInput, ComponentProps<typeof RNTextInput>>(
  (props, ref) => (
    <RNTextInput
      {...props}
      className={clsx(
        "h-[42px] items-start justify-center rounded-xl bg-mauveDark4 px-4 font-satoshi text-base text-mauveDark12",
        props.className
      )}
      cursorColor={mauveDark.mauve12}
      placeholderTextColor={mauveDark.mauve9}
      ref={ref}
      style={[{ lineHeight: undefined }, props.style]}
    />
  )
);
TextInput.displayName = "TextInput";

type OptionalProps = "value" | "onChangeValue" | "defaultValue";
export type CurrencyInput = { getValue: () => number | null };
export const CurrencyInput = forwardRef<
  CurrencyInput,
  Omit<CurrencyInputProps, OptionalProps> &
    Partial<Pick<CurrencyInputProps, OptionalProps>>
>((props, ref) => {
  const [formattedText, setFormattedText] = useState("");
  const [value, setValue] = useState<number | null>(
    props.defaultValue ? Number(props.defaultValue) : null
  );

  useImperativeHandle(
    ref,
    () => ({
      getValue() {
        return value;
      },
    }),
    [value]
  );

  return (
    <View
      className={clsx(
        "relative h-[42px] flex-row items-center justify-start rounded-xl bg-mauveDark4 px-4 text-base",
        props.className
      )}
      style={props.style}
    >
      <Text
        className="mr-2 font-azeret-mono-regular text-mauveDark12"
        style={{ lineHeight: undefined }}
      >
        ₱ {formattedText}
      </Text>

      <RNCurrencyInput
        delimiter=","
        minValue={0}
        precision={0}
        separator="."
        {...props}
        onChangeText={setFormattedText}
        onChangeValue={(v) => {
          props.onChangeValue?.(v);
          setValue(v);
        }}
        renderTextInput={(textInputProps) => (
          <RNTextInput
            cursorColor={"transparent"}
            keyboardType="number-pad"
            placeholder="0.00"
            placeholderTextColor={mauveDark.mauve9}
            {...textInputProps}
            className={clsx(
              "absolute inset-0 pl-8 font-azeret-mono-regular text-transparent opacity-0",
              value === null && "opacity-100"
            )}
            style={{ lineHeight: undefined }}
          />
        )}
        value={props.value || value}
      />
    </View>
  );
});
CurrencyInput.displayName = "CurrencyInput";

export default TextInput;
