import { Text, View } from "react-native"
import { useUser } from "@clerk/clerk-expo"

// import { useRootStackNavigation } from "~/utils/hooks/useRootStackNavigation"
import { useRemoveUser, useSignUp } from "~/utils/hooks/useAuth"

import Button from "~/components/Button"
import SafeAreaView from "~/components/SafeAreaView"
import ScaleDownPressable from "~/components/ScaleDownPressable"

export default function Welcome() {
  // const navigation = useRootStackNavigation()
  const signUp = useSignUp()
  const removeUser = useRemoveUser()
  const { user } = useUser()

  return (
    <SafeAreaView className="bg-violet1 flex-1">
      <View className="h-full items-center justify-center">
        {user ? <Text className="mb-4">{user.id}</Text> : null}
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

        <ScaleDownPressable
          className="mt-4"
          onPress={() => {
            removeUser
              .handleRemoveUser()
              .then(() => {
                console.log("remove successful")
              })
              .catch(console.error)
          }}
          disabled={removeUser.loading}
        >
          <Button loading={removeUser.loading}>
            <Text>Remove user</Text>
          </Button>
        </ScaleDownPressable>
      </View>
    </SafeAreaView>
  )
}
