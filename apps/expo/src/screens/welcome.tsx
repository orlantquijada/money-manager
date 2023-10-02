import { Text, View } from "react-native"
import Button from "~/components/Button"

import SafeAreaView from "~/components/SafeAreaView"

export default function Welcome() {
  return (
    <SafeAreaView className="bg-violet1 flex-1">
      <View className="h-full items-center justify-center px-4">
        <Button>
          <Text>Get Started</Text>
        </Button>
      </View>
    </SafeAreaView>
  )
}
