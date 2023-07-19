import { Dispatch, SetStateAction } from "react"
import { View, ViewProps } from "react-native"

import { NumberButton } from "./NumberButton"

import ChevronLeftIcon from "../../../assets/icons/hero-icons/chevron-left.svg"
import { mauveDark } from "~/utils/colors"

type Props = {
  setNumber: Dispatch<SetStateAction<string>>
} & ViewProps

export function Numpad({ setNumber, ...props }: Props) {
  const handleNumberButtonPress = (num: number) => () => {
    setNumber((prev) =>
      // limit decimal to hundredths
      prev.includes(".") && prev.split(".")[1]?.length === 2
        ? prev
        : prev + num,
    )
  }

  return (
    <View {...props} className="gap-y-2">
      <View className="flex-row gap-x-2">
        {[1, 2, 3].map((num) => (
          <NumberButton onPress={handleNumberButtonPress(num)} key={num}>
            {num}
          </NumberButton>
        ))}
      </View>
      <View className="flex-row gap-x-2">
        {[4, 5, 6].map((num) => (
          <NumberButton onPress={handleNumberButtonPress(num)} key={num}>
            {num}
          </NumberButton>
        ))}
      </View>
      <View className="flex-row gap-x-2">
        {[7, 8, 9].map((num) => (
          <NumberButton onPress={handleNumberButtonPress(num)} key={num}>
            {num}
          </NumberButton>
        ))}
      </View>
      <View className="flex-row gap-x-2">
        <NumberButton
          onPress={() => {
            setNumber((prev) => (prev.includes(".") ? prev : prev + "."))
          }}
        >
          .
        </NumberButton>
        <NumberButton onPress={() => setNumber((prev) => prev + 0)}>
          0
        </NumberButton>
        <NumberButton
          onPress={() =>
            setNumber((prev) => {
              // include removing decimal point if current number on tenths decimal place
              if (prev.includes(".") && prev.split(".")[1]?.length === 1) {
                return prev.slice(0, -2)
              }

              return prev.slice(0, -1)
            })
          }
        >
          <View className="relative">
            <ChevronLeftIcon
              height={20}
              width={20}
              strokeWidth={3.5}
              color={mauveDark.mauve12}
            />
          </View>
        </NumberButton>
      </View>
    </View>
  )
}
