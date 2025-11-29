import { useCallback, useState } from "react";
import { Text, View } from "react-native";
import Animated, { LinearTransition } from "react-native-reanimated";

import {
  CustomSlideInDown,
  CustomSlideOutDown,
  CustomSlideOutUp,
  transitions,
} from "~/utils/motion";

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

// // slide comma to the right instead of exiting
// const getKey = (formattedIndex: number, formatted: string) => {
//   if (formatted[formattedIndex] === ",") {
//     let commaIndex = 0
//     for (let i = 0; i < formattedIndex; i++)
//       if (formatted[i] === ",") commaIndex++
//     return commaIndex
//   }
//
//   let nonCommaIndex = 0
//   for (let i = 0; i < formattedIndex; i++) {
//     if (formatted[i] === ",") continue
//     nonCommaIndex++
//   }
//   return nonCommaIndex
// }

export function useAmount(initialAmount = 0) {
  const [amount, setAmount] = useState(() => initialAmount.toString());

  const reset = useCallback(
    () => setAmount(() => initialAmount.toString()),
    [initialAmount]
  );

  return [Number(amount), setAmount, reset] as const;
}

export function Amount({ amount }: { amount: number }) {
  const formattedAmount = formatter.format(amount);

  return (
    <View className="relative w-full flex-row justify-center">
      <View className="w-full flex-row justify-center overflow-hidden">
        {[...formattedAmount].map((char, i) => (
          <Animated.View
            className="relative"
            entering={CustomSlideInDown as any}
            exiting={
              i === 0 ? (CustomSlideOutUp as any) : (CustomSlideOutDown as any)
            }
            key={char + getKey(i, formattedAmount)}
            layout={LinearTransition.springify()
              .damping(transitions.snappier.damping)
              .stiffness(transitions.snappier.stiffness)}
          >
            {i === 0 && (
              <Text className="-left-2/3 absolute top-0 pt-1.5 font-nunito-bold text-4xl text-mauveDark12">
                ₱
              </Text>
            )}
            <Text className="pt-2.5 font-nunito-extra-bold text-6xl text-mauveDark12">
              {char}
            </Text>
          </Animated.View>
        ))}
      </View>
    </View>
  );
}
