import { Text, View } from "react-native"

// import { useRootStackNavigation } from "~/utils/hooks/useRootStackNavigation"
import { useSignUp } from "~/utils/hooks/useAuth"

import Button from "~/components/Button"
import SafeAreaView from "~/components/SafeAreaView"
import ScaleDownPressable from "~/components/ScaleDownPressable"

export default function Welcome() {
  // const navigation = useRootStackNavigation()
  const signUp = useSignUp()

  return (
    <SafeAreaView className="bg-violet1 flex-1">
      <View className="h-full items-center justify-center">
        <ScaleDownPressable
          onPress={() => {
            signUp
              .handleSignUp()
              .then(() => {
                // navigation.navigate("Root", { params: { text: "hello" } })
                console.log("signup successful")
              })
              .catch(console.error)
          }}
          disabled={signUp.loading}
        >
          <Button loading={signUp.loading}>
            <Text>Get Started</Text>
          </Button>
        </ScaleDownPressable>
      </View>
    </SafeAreaView>
  )
}
