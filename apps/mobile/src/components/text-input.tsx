import type { ReactNode } from "react";
import {
  TextInput as RNTextInput,
  Text,
  type TextInputProps,
  View,
  type ViewProps,
} from "react-native";
import { cn } from "@/utils/cn";
import { mauveDark } from "@/utils/colors";

const slots = {
  container: "h-10 rounded-xl bg-mauveDark4 px-4 flex-row items-center",
  input:
    "font-satoshi text-base text-mauveDark12 placeholder:text-mauveDark9 flex-1",
};

type Props = TextInputProps;

export default function TextInput({ className, style, ...props }: Props) {
  return (
    <RNTextInput
      className={cn(slots.container, slots.input, className)}
      cursorColor={mauveDark.mauveDark12}
      selectionColor={mauveDark.mauveDark12}
      style={[{ lineHeight: undefined, borderCurve: "continuous" }, style]}
      {...props}
    />
  );
}

type InputGroupProps = {
  containerProps?: ViewProps;
  left?: ReactNode;
  right?: ReactNode;
} & TextInputProps;

export function InputGroup({
  containerProps,
  left,
  right,
  className,
  style,
  ...props
}: InputGroupProps) {
  return (
    <View
      {...containerProps}
      className={cn(slots.container, containerProps?.className)}
      style={[{ borderCurve: "continuous" }, containerProps?.style]}
    >
      {left}

      <RNTextInput
        className={cn(slots.input, "h-full", className)}
        cursorColor={mauveDark.mauveDark12}
        selectionColor={mauveDark.mauveDark12}
        style={[{ lineHeight: undefined }, style]}
        {...props}
      />

      {right}
    </View>
  );
}

export function CurrencyInput(props: InputGroupProps) {
  return (
    <InputGroup
      className="font-azeret-mono-regular"
      containerProps={{ className: "gap-2" }}
      keyboardType="decimal-pad"
      left={
        <Text
          className="font-azeret-mono-regular text-mauveDark12"
          style={{ lineHeight: undefined }}
        >
          ₱
        </Text>
      }
      placeholder="0.00"
      {...props}
    />
  );
}
