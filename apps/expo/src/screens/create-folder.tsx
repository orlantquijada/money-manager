import { View, Pressable, ScrollView, Text } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

import { useRootStackNavigation } from "~/utils/hooks/useRootStackNavigation"

import CrossIcon from "../../assets/icons/cross.svg"
import Presence from "~/components/Presence"
import TextInput from "~/components/TextInput"
import Footer from "~/components/create-fund/footer"

export default function CreateFolder() {
  return (
    <SafeAreaView className="bg-mauveDark1 flex-1 pt-4">
      <View className="mb-8 pl-4">
        <Close />
      </View>

      <ScrollView
        className="p-4 pt-0"
        contentContainerStyle={{ paddingBottom: 16 }}
      >
        <View className="flex gap-y-8">
          <Presence delayMultiplier={3}>
            <View className="gap-[10px]">
              <Text className="text-mauveDark12 font-satoshi-medium text-lg">
                What's the name of your fund?
              </Text>
              <TextInput placeholder="new-fund" autoFocus />
            </View>
          </Presence>
        </View>
      </ScrollView>
      <Footer />
    </SafeAreaView>
  )
}

function Close() {
  const navigation = useRootStackNavigation()
  return (
    <Pressable
      className="bg-mauveDark12 flex h-8 w-8 items-center justify-center rounded-full"
      onPress={navigation.goBack}
    >
      <CrossIcon />
    </Pressable>
  )
}
