import { useState } from "react"
import { View, Pressable, ScrollView, Text } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

import { useRootStackNavigation } from "~/utils/hooks/useRootStackNavigation"
import { trpc } from "~/utils/trpc"
import { getRandomChoice } from "~/utils/functions"
import { COMMON_FOLDER_NAMES } from "~/utils/constants"

import Presence from "~/components/Presence"
import TextInput from "~/components/TextInput"
import CreateFooter from "~/components/CreateFooter"

import CrossIcon from "../../assets/icons/cross.svg"

export default function CreateFolder() {
  return (
    <SafeAreaView className="bg-mauveDark1 flex-1 pt-4">
      <View className="mb-8 pl-4">
        <Close />
      </View>

      <Form />
    </SafeAreaView>
  )
}

function Form() {
  const [folderName, setFolderName] = useState("")
  const { mutate, status } = trpc.folder.create.useMutation()
  const navigation = useRootStackNavigation()
  const utils = trpc.useContext()

  return (
    <>
      <ScrollView
        className="p-4 pt-0"
        contentContainerStyle={{ paddingBottom: 16 }}
      >
        <View className="flex gap-y-8">
          <Presence delayMultiplier={3}>
            <View className="gap-[10px]">
              <Text className="text-mauveDark12 font-satoshi-medium text-lg">
                What's the name of your folder?
              </Text>
              <TextInput
                placeholder={getRandomChoice(COMMON_FOLDER_NAMES)}
                autoFocus
                value={folderName}
                onChangeText={setFolderName}
              />
            </View>
          </Presence>
        </View>
      </ScrollView>
      <CreateFooter
        disabled={!folderName.length}
        loading={status === "loading"}
        hideBackButton
        onContinuePress={() =>
          mutate(
            { name: folderName, userId: "clcu8wkkg0000rfzh9sbowx69" },
            {
              onSuccess: async () => {
                await utils.folder.listWithFunds.invalidate()
                navigation.navigate("Root", { screen: "Home" })
              },
            },
          )
        }
      />
    </>
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
