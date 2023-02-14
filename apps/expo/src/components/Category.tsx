import { View, Text, ViewProps } from "react-native"

import Stripes from "@assets/icons/stripes-small.svg"
import clsx from "clsx"

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
          ₱{(252).toFixed(2)} left this week
        </Text>
      </View>

      <View className="mt-2 flex-row gap-x-2">
        <ProgressBar />
        <ProgressBar />
      </View>
    </View>
  )
}

function ProgressBar({
  className,
  style,
}: Pick<ViewProps, "className" | "style">) {
  return (
    <View
      className={clsx(
        "relative flex-1 overflow-hidden rounded-full",
        className,
      )}
      style={style}
    >
      <View className="bg-mauve2 border-mauve3 h-2 w-full border" />

      <View className="absolute inset-0 z-0">
        <Stripes />
      </View>
    </View>
  )
}
