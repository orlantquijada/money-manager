import clsx from "clsx"
import { View, Text } from "react-native"

import Button from "./Button"
import ScaleDownPressable from "./ScaleDownPressable"

type Props = {
  disabled?: boolean
  loading?: boolean
  onBackPress?: () => void
  onContinuePress?: () => void
  hideBackButton?: boolean
}

export default function CreateFooter({
  disabled = false,
  loading = false,
  hideBackButton = false,
  onBackPress,
  onContinuePress,
}: Props) {
  return (
    <View className="border-t-mauveDark8 bg-mauveDark1 flex flex-row justify-between border-t p-4">
      <ScaleDownPressable
        disabled={hideBackButton}
        className={clsx("h-8 justify-center", hideBackButton && "opacity-0")}
        onPress={onBackPress}
      >
        <Text className="font-satoshi-medium text-mauveDark12 text-sm">
          Back
        </Text>
      </ScaleDownPressable>
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
