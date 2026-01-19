import { useCallback, useState } from "react";
import Animated from "react-native-reanimated";
import { StyledLeanText, StyledLeanView } from "@/config/interop";
import {
  DigitSlideIn,
  DigitSlideOutDown,
  DigitSlideOutUp,
  layoutSpringify,
} from "@/utils/motion";
import type { NumpadKey } from "./numpad";

const formatter = Intl.NumberFormat("en-PH", {
  maximumFractionDigits: 2,
});

const getKey = (formattedIndex: number, formatted: string) => {
  if (formatted[formattedIndex] === ",") {
    return `,-${formattedIndex}`;
  }

  let nonCommaIndex = 0;
  for (let i = 0; i < formattedIndex; i++) {
    if (formatted[i] === ",") {
      continue;
    }
    nonCommaIndex++;
  }
  return nonCommaIndex;
};

function applyKey(prev: string, key: NumpadKey): string {
  if (key === "backspace") {
    return prev.length === 1 ? "0" : prev.slice(0, -1);
  }

  if (key === ".") {
    return prev.includes(".") ? prev : `${prev}.`;
  }

  // Digit pressed - check decimal limit
  const decimalIndex = prev.indexOf(".");
  const atDecimalLimit =
    decimalIndex !== -1 && prev.length - decimalIndex - 1 >= 2;
  if (atDecimalLimit) return prev;

  // Replace leading zero if it's just "0"
  return prev === "0" ? key : `${prev}${key}`;
}

export function useAmount() {
  const [amount, setAmount] = useState("0");

  const handleKeyPress = useCallback(
    (key: NumpadKey) => setAmount((prev) => applyKey(prev, key)),
    []
  );

  const reset = useCallback(() => setAmount("0"), []);

  return { amount: Number(amount), handleKeyPress, reset };
}

export function Amount({ amount }: { amount: number }) {
  const formattedAmount = formatter.format(amount);

  return (
    <StyledLeanView className="relative w-full flex-row justify-center">
      {/* <View className="w-full flex-row justify-center overflow-hidden"> */}
      <StyledLeanView className="w-full flex-row justify-center">
        {[...formattedAmount].map((char, i) => (
          <Animated.View
            className="relative"
            entering={DigitSlideIn}
            exiting={i === 0 ? DigitSlideOutUp : DigitSlideOutDown}
            key={char + getKey(i, formattedAmount)}
            layout={layoutSpringify("snappier")}
          >
            {i === 0 && (
              <StyledLeanText className="absolute top-0 -left-2/3 pt-1.5 font-nunito-bold text-4xl text-foreground">
                ₱
              </StyledLeanText>
            )}
            <StyledLeanText className="pt-2.5 font-nunito-extra-bold text-6xl text-foreground">
              {char}
            </StyledLeanText>
          </Animated.View>
        ))}
      </StyledLeanView>
    </StyledLeanView>
  );
}
