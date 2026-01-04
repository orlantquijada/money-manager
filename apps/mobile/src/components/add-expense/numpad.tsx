import type { ReactNode } from "react";
import {
  Pressable,
  type PressableProps,
  type ViewProps,
  type ViewStyle,
} from "react-native";
import { ChevronLeft } from "@/icons";
import { cn } from "@/utils/cn";
import { mauve } from "@/utils/colors";
import LeanText from "../lean-text";
import LeanView from "../lean-view";

export type NumpadKey =
  | "0"
  | "1"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "."
  | "backspace";

function NumberButton({
  children,
  style,
  className,
  ...rest
}: PressableProps & { children?: ReactNode; style?: ViewStyle }) {
  return (
    <Pressable
      {...rest}
      className={cn(
        "group h-12 flex-1 items-center justify-center rounded-lg bg-mauve1 transition-all active:bg-mauve3",
        className
      )}
      style={[{ borderCurve: "continuous" }, style]}
    >
      <LeanText className="font-nunito-bold text-2xl text-mauve12 transition-all group-active:scale-125">
        {children}
      </LeanText>
    </Pressable>
  );
}

type Props = ViewProps & {
  onPress?: (key: NumpadKey) => void;
};

export default function Numpad({ className, onPress, ...props }: Props) {
  return (
    <LeanView {...props} className={cn("gap-2", className)}>
      {[
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
      ].map((row) => (
        <LeanView className="flex-row gap-2" key={row[0]}>
          {row.map((num) => (
            <NumberButton
              key={num}
              onPress={() => onPress?.(String(num) as NumpadKey)}
            >
              {num}
            </NumberButton>
          ))}
        </LeanView>
      ))}
      <LeanView className="flex-row gap-2">
        <NumberButton onPress={() => onPress?.(".")}>.</NumberButton>
        <NumberButton onPress={() => onPress?.("0")}>0</NumberButton>
        <NumberButton onPress={() => onPress?.("backspace")}>
          <ChevronLeft color={mauve.mauve12} size={20} strokeWidth={3.5} />
        </NumberButton>
      </LeanView>
    </LeanView>
  );
}
