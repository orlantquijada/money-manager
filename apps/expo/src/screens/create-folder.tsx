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
      <View className="mx-4 mb-8 self-start">
        <Close />
      </View>

      <Form />
    </SafeAreaView>
  )
}

function Form() {
  const [folderName, setFolderName] = useState("")
  const navigation = useRootStackNavigation()

  const createFolder = useCreateFolder()

  const [didSubmit, setDidSubmit] = useState(false)
  const loading = createFolder.status === "loading" || didSubmit
  const disabled = !folderName.length || loading

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
                What&apos;s the name of your folder?
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
        disabled={disabled}
        loading={loading}
        hideBackButton
        onContinuePress={() => {
          setDidSubmit(true)
          createFolder.mutate(
            { name: folderName, userId: "clkqj34q70000t7wc7me5srpq" },
            {
              onSuccess: (folder) => {
                navigation.navigate("Root", {
                  screen: "Home",
                  params: { recentlyAddedToFolderId: folder.id },
                })
              },
            },
          )
        }}
      >
        Save
      </CreateFooter>
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

function useCreateFolder() {
  const utils = trpc.useContext()

  return trpc.folder.create.useMutation({
    // optimistic update stuff
    onMutate: async (newFolder) => {
      await utils.folder.listWithFunds.cancel()

      const previousFolders = utils.folder.listWithFunds.getData() || []
      utils.folder.listWithFunds.setData(undefined, [
        {
          ...newFolder,
          // `id` can be hardcoded since it isn't used as `key` in `folder.listWithFunds` flatlist in Dashboard screen
          id: 12345,
          createdAt: null,
          updatedAt: null,
          funds: [],
        },
        ...previousFolders,
      ])

      return { previousFolders, newFolder }
    },
    onError(_, __, context) {
      utils.folder.listWithFunds.setData(undefined, context?.previousFolders)
    },
    onSettled: () => {
      utils.folder.listWithFunds.invalidate()
    },
  })
}
