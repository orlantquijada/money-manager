import { View, Text, Pressable } from "react-native"
import Button from "../Button"

export default function Footer() {
  return (
    <View className="border-t-mauveDark8 bg-mauveDark1 flex flex-row justify-between border-t p-4">
      <Pressable className="h-8 justify-center">
        <Text className="font-satoshi-medium text-mauveDark12 text-sm">
          Back
        </Text>
      </Pressable>
      <Pressable>
        <Button disabled>
          <Text
            className="font-satoshi-medium text-mauveDark1 text-sm"
            style={{ lineHeight: 16 }}
          >
            Continue
          </Text>
        </Button>
      </Pressable>
    </View>
  )
}
