import { useUser } from "@clerk/clerk-expo";
import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CreateFooter from "~/components/CreateFooter";
import Presence from "~/components/Presence";
import TextInput from "~/components/TextInput";
import { COMMON_FOLDER_NAMES } from "~/utils/constants";
import { getRandomChoice } from "~/utils/functions";
import { useRootStackNavigation } from "~/utils/hooks/useRootStackNavigation";
import { trpc } from "~/utils/trpc";

import CrossIcon from "../../assets/icons/cross.svg";

export default function CreateFolder() {
  return (
    <SafeAreaView className="flex-1 bg-mauveDark1 pt-4">
      <View className="mx-4 mb-8 self-start">
        <Close />
      </View>

      <Form />
    </SafeAreaView>
  );
}

function Form() {
  const [folderName, setFolderName] = useState("");
  const navigation = useRootStackNavigation();

  const createFolder = useCreateFolder();

  const [didSubmit, setDidSubmit] = useState(false);
  const loading = createFolder.status === "loading" || didSubmit;
  const disabled = !folderName.length || loading;

  return (
    <>
      <ScrollView
        className="p-4 pt-0"
        contentContainerStyle={{ paddingBottom: 16 }}
      >
        <View className="flex gap-y-8">
          <Presence delayMultiplier={3}>
            <View className="gap-[10px]">
              <Text className="font-satoshi-medium text-lg text-mauveDark12">
                What&apos;s the name of your folder?
              </Text>
              <TextInput
                onChangeText={setFolderName}
                // autoFocus
                placeholder={getRandomChoice(COMMON_FOLDER_NAMES)}
                value={folderName}
              />
            </View>
          </Presence>
        </View>
      </ScrollView>
      <CreateFooter
        disabled={disabled}
        hideBackButton
        loading={loading}
        onContinuePress={() => {
          setDidSubmit(true);
          createFolder.mutate(
            { name: folderName },
            {
              onSuccess: (folder) => {
                navigation.navigate("Root", {
                  screen: "Home",
                  params: {
                    screen: "Budgets",
                    params: { recentlyAddedToFolderId: folder.id },
                  },
                });
              },
            }
          );
        }}
      >
        Save
      </CreateFooter>
    </>
  );
}

function Close() {
  const navigation = useRootStackNavigation();
  return (
    <Pressable
      className="flex h-8 w-8 items-center justify-center rounded-full bg-mauveDark12"
      onPress={navigation.goBack}
    >
      <CrossIcon />
    </Pressable>
  );
}

function useCreateFolder() {
  const utils = trpc.useContext();
  const { user } = useUser();

  return trpc.folder.create.useMutation({
    // optimistic update stuff
    onMutate: async (newFolder) => {
      await utils.folder.listWithFunds.cancel();

      const previousFolders = utils.folder.listWithFunds.getData() || [];
      utils.folder.listWithFunds.setData(undefined, [
        {
          ...newFolder,
          // `id` can be hardcoded since it isn't used as `key` in `folder.listWithFunds` flatlist in Dashboard screen
          id: 12_345,
          createdAt: null,
          updatedAt: null,
          funds: [],
          userId: user?.id || "",
        },
        ...previousFolders,
      ]);

      return { previousFolders, newFolder };
    },
    onError(_, __, context) {
      utils.folder.listWithFunds.setData(undefined, context?.previousFolders);
    },
    onSettled: () => {
      utils.folder.listWithFunds.invalidate();
    },
  });
}
