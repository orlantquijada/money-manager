// import { SignedIn, SignedOut, useUser } from "@clerk/clerk-expo";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import Button from "~/components/Button";
import SafeAreaView from "~/components/SafeAreaView";
import ScaleDownPressable from "~/components/ScaleDownPressable";
// import { useRootStackNavigation } from "~/utils/hooks/useRootStackNavigation"
import {
  useRemoveUser,
  useSignIn,
  useSignOut,
  useSignUp,
} from "~/utils/hooks/useAuth";
// import { useOnboarding } from "~/utils/hooks/useOnboarding";
import { useRootStackNavigation } from "~/utils/hooks/useRootStackNavigation";
import { getCredId } from "~/utils/lib/auth";

export default function Welcome() {
  // const navigation = useRootStackNavigation()
  const removeUser = useRemoveUser();
  const signOut = useSignOut();
  // const { user } = useUser();
  const user = null;

  return (
    <SafeAreaView className="flex-1 bg-violet1">
      <View className="h-full items-center justify-center">
        {user ? <Text className="mb-4">{user.id}</Text> : null}

        {/* <SignedOut>
          <SignInButtons />
        </SignedOut> */}

        <SignInButtons />

        <ScaleDownPressable
          disabled={signOut.loading}
          onPress={() => {
            signOut.handleSignOut();
          }}
        >
          <Button loading={signOut.loading}>
            <Text>Sign Out</Text>
          </Button>
        </ScaleDownPressable>

        <ScaleDownPressable
          className="mt-4"
          disabled={removeUser.loading}
          onPress={() => {
            removeUser
              .handleRemoveUser()
              .then(() => {
                console.log("remove successful");
              })
              .catch(console.error);
          }}
        >
          <Button loading={removeUser.loading}>
            <Text>Remove user</Text>
          </Button>
        </ScaleDownPressable>
      </View>
    </SafeAreaView>
  );
}

function SignInButtons() {
  const signIn = useSignIn();
  const signUp = useSignUp();
  const [hasCreds, setHasCreds] = useState(false);
  const navigation = useRootStackNavigation();
  // const { didFirstLaunch } = useOnboarding();
  const didFirstLaunch = true;

  useEffect(() => {
    getCredId()
      .then((id) => setHasCreds(Boolean(id)))
      .catch(() => setHasCreds(false));
  }, []);

  if (hasCreds) {
    return (
      <ScaleDownPressable
        disabled={signIn.loading}
        onPress={() => {
          signIn
            .handleSignIn()
            .then(() => {
              if (didFirstLaunch) {
                navigation.popToTop();
              } else {
                navigation.navigate("Onboarding");
              }
            })
            .catch(console.error);
        }}
      >
        <Button loading={signIn.loading}>
          <Text>(Get started) Sign in</Text>
        </Button>
      </ScaleDownPressable>
    );
  }

  return (
    <ScaleDownPressable
      disabled={signUp.loading}
      onPress={() => {
        signUp
          .handleSignUp()
          .then(() => {
            // navigation.navigate("Root", { params: { text: "hello" } })
            console.log("signup successful");
          })
          .catch(console.error);
      }}
    >
      <Button loading={signUp.loading}>
        <Text>Get Started</Text>
      </Button>
    </ScaleDownPressable>
  );
}
