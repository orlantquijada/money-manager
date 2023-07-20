import { View, Text } from "react-native"
import Animated, { Layout } from "react-native-reanimated"

import {
  CustomSlideInDown,
  CustomSlideOutDown,
  CustomSlideOutUp,
  transitions,
} from "~/utils/motion"

const formatter = Intl.NumberFormat("en-PH", {
  maximumFractionDigits: 2,
})

const getKey = (formattedIndex: number, formatted: string) => {
  if (formatted[formattedIndex] === ",") return `,-${formattedIndex}`

  let nonCommaIndex = 0
  for (let i = 0; i < formattedIndex; i++) {
    if (formatted[i] === ",") continue
    nonCommaIndex++
  }
  return nonCommaIndex
}

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

export function Amount({ amount }: { amount: number }) {
  const formattedAmount = formatter.format(amount)

  return (
    <View className="relative w-full flex-row justify-center">
      <View className="w-full flex-row justify-center overflow-hidden">
        <Animated.Text
          layout={Layout.springify()
            .damping(transitions.snappier.damping)
            .stiffness(transitions.snappier.stiffness)}
          className="font-nunito-bold text-mauveDark12 pt-1.5 text-4xl"
        >
          ₱
        </Animated.Text>
        {[...formattedAmount].map((char, i) => (
          <Animated.View
            key={char + getKey(i, formattedAmount)}
            exiting={
              i === 0
                ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  (CustomSlideOutUp as any)
                : // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  (CustomSlideOutDown as any)
            } // eslint-disable-next-line @typescript-eslint/no-explicit-any
            entering={CustomSlideInDown as any}
            layout={Layout.springify()
              .damping(transitions.snappier.damping)
              .stiffness(transitions.snappier.stiffness)}
          >
            <Text className="font-nunito-extra-bold text-mauveDark12 pt-2.5 text-6xl">
              {char}
            </Text>
          </Animated.View>
        ))}
      </View>
    </View>
  )
}
