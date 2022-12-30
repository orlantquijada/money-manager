import { View, Text } from "react-native"

import Stripes from "@assets/icons/stripes-small.svg"

type Props = {
  name: string
  isFirstChild?: boolean
}

export default function Category({ name, isFirstChild = false }: Props) {
  return (
    <View className="px-4" style={{ borderBottomStartRadius: 16 }}>
      <View
        // className={`py-2 ${!isFirstChild ? "border-mauve3 border-t " : ""}`}
        className={`py-2 `}
      >
        <View className="flex-row justify-between ">
          <Text className="font-satoshi-medium text-violet12 text-base">
            {name}
          </Text>

          {/* <Text className="font-satoshi-medium text-violet12 text-sm opacity-80"> */}
          {/*   ₱{(252).toFixed(2)} */}
          {/* </Text> */}

          {/* different text format per target type */}
          <Text className="font-satoshi text-mauve11 mt-1 text-xs">
            ₱{(252).toFixed(2)} left to spend
          </Text>
        </View>

        {/* progress bar */}
        <View className="relative mt-2 w-full overflow-hidden rounded-full ">
          <View className="bg-mauve2 border-mauve3 h-2 w-full border" />

          <View className="absolute inset-0 z-0">
            <Stripes />
          </View>
        </View>
      </View>
    </View>
  )
}
