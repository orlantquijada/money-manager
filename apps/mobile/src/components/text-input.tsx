import type { ReactNode } from "react";
import {
  TextInput as RNTextInput,
  type TextInputProps,
  type ViewProps,
} from "react-native";
import { StyledLeanText, StyledLeanView } from "@/config/interop";
import { cn } from "@/utils/cn";
import { useThemeColor } from "./theme-provider";

const slots = {
  container: "h-10 rounded-xl bg-muted px-4 flex-row items-center",
  input:
    "font-satoshi text-base text-foreground placeholder:text-foreground-muted",
};

type Props = TextInputProps;

export default function TextInput({ className, style, ...props }: Props) {
  const cursorColor = useThemeColor("foreground");
  return (
    <RNTextInput
      className={cn(slots.container, slots.input, className)}
      cursorColor={cursorColor}
      selectionColor={cursorColor}
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
  const cursorColor = useThemeColor("foreground");

  return (
    <StyledLeanView
      {...containerProps}
      className={cn(slots.container, containerProps?.className)}
      style={[{ borderCurve: "continuous" }, containerProps?.style]}
    >
      {left}

      <RNTextInput
        className={cn(slots.input, "h-full", className)}
        cursorColor={cursorColor}
        selectionColor={cursorColor}
        style={[{ lineHeight: undefined }, style]}
        {...props}
      />

      {right}
    </StyledLeanView>
  );
}

export function CurrencyInput(props: InputGroupProps) {
  return (
    <InputGroup
      className="flex-1 font-azeret-mono-regular"
      containerProps={{ className: "gap-2" }}
      keyboardType="decimal-pad"
      left={
        <StyledLeanText
          className="font-azeret-mono-regular text-foreground"
          style={{ lineHeight: undefined }}
        >
          ₱
        </StyledLeanText>
      }
      placeholder="0.00"
      {...props}
    />
  );
}
