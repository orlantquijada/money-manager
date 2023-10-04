import { Text, View } from "react-native"

// import { useRootStackNavigation } from "~/utils/hooks/useRootStackNavigation"

import Button from "~/components/Button"
import SafeAreaView from "~/components/SafeAreaView"
import ScaleDownPressable from "~/components/ScaleDownPressable"
import { useSignUp } from "~/utils/hooks/useAuth"

export default function Welcome() {
  // const navigation = useRootStackNavigation()
  const { handleSignUp } = useSignUp()

  return (
    <SafeAreaView className="bg-violet1 flex-1">
      <View className="h-full items-center justify-center">
        <ScaleDownPressable
          onPress={() => {
            handleSignUp()
              .then(() => {
                // navigation.navigate("Root", { params: { text: "hello" } })
                console.log("wowow")
              })
              .catch(console.error)
          }}
        >
          <Button>
            <Text>Get Started</Text>
          </Button>
        </ScaleDownPressable>
      </View>
    </SafeAreaView>
  )
}
