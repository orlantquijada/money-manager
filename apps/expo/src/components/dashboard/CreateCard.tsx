import type { MotiPressable } from "moti/interactions";
import type { ComponentProps, FC } from "react";
import { Text, View } from "react-native";
import type { SvgProps } from "react-native-svg";
import ScaleDownPressable from "../ScaleDownPressable";

type Props = {
  Icon: FC<SvgProps>;
  title: string;
  description: string;
} & Pick<ComponentProps<typeof MotiPressable>, "onPress">;

export default function CreateCard({
  Icon,
  title,
  description,
  onPress,
}: Props) {
  return (
    <ScaleDownPressable
      className="w-full flex-row bg-mauveDark1 px-6 py-4"
      onPress={onPress}
      opacity={0.7}
      scale={0.98}
      transition={{ type: "timing", duration: 200 }}
    >
      <View className="mr-4 pt-[6px]">
        <Icon height={18} width={18} />
      </View>
      <View className="flex-1">
        <Text className="font-satoshi-medium text-base text-mauveDark12">
          {title}
        </Text>
        <Text className="font-satoshi text-mauveDark11 text-sm">
          {description}
        </Text>
      </View>
    </ScaleDownPressable>
  );
}
