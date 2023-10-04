import { useEffect, useState } from "react"
import { Text, View } from "react-native"
import { SignedIn, SignedOut, useUser } from "@clerk/clerk-expo"

// import { useRootStackNavigation } from "~/utils/hooks/useRootStackNavigation"
import {
  useRemoveUser,
  useSignIn,
  useSignOut,
  useSignUp,
} from "~/utils/hooks/useAuth"

import Button from "~/components/Button"
import SafeAreaView from "~/components/SafeAreaView"
import ScaleDownPressable from "~/components/ScaleDownPressable"
import { getCredId } from "~/utils/lib/auth"

export default function Welcome() {
  // const navigation = useRootStackNavigation()
  const removeUser = useRemoveUser()
  const signOut = useSignOut()
  const { user } = useUser()

  return (
    <SafeAreaView className="bg-violet1 flex-1">
      <View className="h-full items-center justify-center">
        {user ? <Text className="mb-4">{user.id}</Text> : null}

        <SignedOut>
          <SignInButtons />
        </SignedOut>

        <SignedIn>
          <ScaleDownPressable
            onPress={() => {
              signOut.handleSignOut()
            }}
            disabled={signOut.loading}
          >
            <Button loading={signOut.loading}>
              <Text>Sign Out</Text>
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
        </SignedIn>
      </View>
    </SafeAreaView>
  )
}

function SignInButtons() {
  const signIn = useSignIn()
  const signUp = useSignUp()
  const [hasCreds, setHasCreds] = useState(false)

  useEffect(() => {
    getCredId()
      .then((id) => setHasCreds(Boolean(id)))
      .catch(() => setHasCreds(false))
  }, [])

  if (hasCreds) {
    return (
      <ScaleDownPressable
        onPress={() => {
          signIn
            .handleSignIn()
            .then(() => {
              // navigation.navigate("Root", { params: { text: "hello" } })
              console.log("sign in successful")
            })
            .catch(console.error)
        }}
        disabled={signIn.loading}
      >
        <Button loading={signIn.loading}>
          <Text>Sign in</Text>
        </Button>
      </ScaleDownPressable>
    )
  }

  return (
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
  )
}
