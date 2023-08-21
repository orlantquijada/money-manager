import { ComponentProps, FC } from "react"
import { View, Text } from "react-native"
import { SvgProps } from "react-native-svg"
import { MotiPressable } from "moti/interactions"
import ScaleDownPressable from "../ScaleDownPressable"

type Props = {
  Icon: FC<SvgProps>
  title: string
  description: string
} & Pick<ComponentProps<typeof MotiPressable>, "onPress">

export default function CreateCard({
  Icon,
  title,
  description,
  onPress,
}: Props) {
  return (
    <ScaleDownPressable
      className="bg-mauveDark1 w-full flex-row px-6 py-4"
      transition={{ type: "timing", duration: 200 }}
      scale={0.98}
      opacity={0.7}
      onPress={onPress}
    >
      <View className="mr-4 pt-[6px]">
        <Icon width={18} height={18} />
      </View>
      <View className="flex-1">
        <Text className="text-mauveDark12 font-satoshi-medium text-base">
          {title}
        </Text>
        <Text className="text-mauveDark11 font-satoshi text-sm">
          {description}
        </Text>
      </View>
    </ScaleDownPressable>
  )
}
