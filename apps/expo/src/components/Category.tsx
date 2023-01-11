import { View, Text } from "react-native"

import Stripes from "@assets/icons/stripes-small.svg"

type Props = {
  name: string
}

export default function Category({ name }: Props) {
  return (
    <View className="py-2 px-4">
      <View className="flex-row justify-between ">
        <Text className="font-satoshi-medium text-violet12 text-base">
          {name}
        </Text>

        {/* different text format per target type */}
        <Text className="font-satoshi text-mauve9 mt-1 text-xs">
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
  )
}
