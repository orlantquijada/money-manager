import { FC, useMemo } from "react"
import { View, Text } from "react-native"
import { SvgProps } from "react-native-svg"
import { MotiPressable } from "moti/interactions"
import { styled } from "nativewind"

type Props = {
  Icon: FC<SvgProps>
  title: string
  description: string
}

const StyledMotiPressable = styled(MotiPressable)

export default function CreateCard({ Icon, title, description }: Props) {
  return (
    <StyledMotiPressable
      className="bg-mauveDark1 flex-row gap-x-4 px-6 py-4"
      transition={{ type: "timing", duration: 200 }}
      animate={useMemo(
        () =>
          ({ pressed }) => {
            "worklet"

            return {
              scale: pressed ? 0.98 : 1,
              opacity: pressed ? 0.7 : 1,
            }
          },
        [],
      )}
    >
      <View className="pt-[6px]">
        <Icon width={16} height={16} />
      </View>
      <View className="flex-1">
        <Text className="text-mauveDark12 font-satoshi-medium text-base">
          {title}
        </Text>
        <Text className="text-mauveDark11 font-satoshi text-sm">
          {description}
        </Text>
      </View>
    </StyledMotiPressable>
  )
}
