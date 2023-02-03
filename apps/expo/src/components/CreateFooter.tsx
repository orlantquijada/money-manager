import { View, Text, Pressable } from "react-native"

import Button from "./Button"
import ScaleDownPressable from "./ScaleDownPressable"

type Props = {
  disabled?: boolean
  loading?: boolean
  onContinuePress?: () => void
}

export default function CreateFooter({
  disabled = false,
  loading = false,
  onContinuePress,
}: Props) {
  return (
    <View className="border-t-mauveDark8 bg-mauveDark1 flex flex-row justify-between border-t p-4">
      <Pressable className="h-8 justify-center">
        <Text className="font-satoshi-medium text-mauveDark12 text-sm">
          Back
        </Text>
      </Pressable>
      <ScaleDownPressable
        disabled={disabled || loading}
        onPress={onContinuePress}
      >
        <Button disabled={disabled} loading={loading}>
          <Text
            className={"font-satoshi-medium text-mauveDark1 text-sm"}
            style={{ lineHeight: 16 }}
          >
            Continue
          </Text>
        </Button>
      </ScaleDownPressable>
    </View>
  )
}
