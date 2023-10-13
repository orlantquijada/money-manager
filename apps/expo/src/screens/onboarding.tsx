import { Pressable, Text, View } from "react-native"
import Button from "~/components/Button"
import SafeAreaView from "~/components/SafeAreaView"
import { useOnboarding } from "~/utils/hooks/useOnboarding"
import { useRootStackNavigation } from "~/utils/hooks/useRootStackNavigation"

export default function Onboarding() {
  const navigation = useRootStackNavigation()
  const { handleSetFirstLaunch } = useOnboarding()

  return (
    <SafeAreaView className="bg-violet1 flex-1">
      <View className="h-full items-center justify-center">
        {/* {user ? <Text className="mb-4">{user.id}</Text> : null} */}
        <Pressable
          onPress={() => {
            handleSetFirstLaunch()
            navigation.popToTop()
          }}
        >
          <Button>
            <Text>Finish Onboarding</Text>
          </Button>
        </Pressable>

        {/* <SignedOut> */}
        {/*   <SignInButtons /> */}
        {/* </SignedOut> */}
        {/**/}
        {/* <SignedIn> */}
        {/*   <ScaleDownPressable */}
        {/*     onPress={() => { */}
        {/*       signOut.handleSignOut() */}
        {/*     }} */}
        {/*     disabled={signOut.loading} */}
        {/*   > */}
        {/*     <Button loading={signOut.loading}> */}
        {/*       <Text>Sign Out</Text> */}
        {/*     </Button> */}
        {/*   </ScaleDownPressable> */}
        {/**/}
        {/*   <ScaleDownPressable */}
        {/*     className="mt-4" */}
        {/*     onPress={() => { */}
        {/*       removeUser */}
        {/*         .handleRemoveUser() */}
        {/*         .then(() => { */}
        {/*           console.log("remove successful") */}
        {/*         }) */}
        {/*         .catch(console.error) */}
        {/*     }} */}
        {/*     disabled={removeUser.loading} */}
        {/*   > */}
        {/*     <Button loading={removeUser.loading}> */}
        {/*       <Text>Remove user</Text> */}
        {/*     </Button> */}
        {/*   </ScaleDownPressable> */}
        {/* </SignedIn> */}
      </View>
    </SafeAreaView>
  )
}
