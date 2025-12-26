import { useNavigation, usePreventRemove } from "@react-navigation/native";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { RouterOutputs } from "api";
import { Link, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { Alert, ScrollView, Text, View } from "react-native";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import CreateFooter, { FOOTER_HEIGHT } from "@/components/create-fund/footer";
import ModalCloseBtn from "@/components/modal-close-btn";
import Presence from "@/components/presence";
import TextInput from "@/components/text-input";
import { FOLDER_NAME_PLACEHOLDERS } from "@/lib/create-fund";
import { trpc } from "@/utils/api";
import { choice } from "@/utils/random";

export default function CreateFolder() {
  const { name, setName, submit, isPending, isDirty } = useCreateFolderForm();
  const placeholder = useMemo(() => choice(FOLDER_NAME_PLACEHOLDERS), []);
  const navigation = useNavigation();

  usePreventRemove(isDirty, ({ data }) => {
    Alert.alert(
      "Discard changes?",
      "You have unsaved changes. Are you sure you want to discard them?",
      [
        { text: "Don't leave", style: "cancel" },
        {
          text: "Discard",
          style: "destructive",
          onPress: () => navigation.dispatch(data.action),
        },
      ]
    );
  });

  return (
    <KeyboardAvoidingView
      behavior="padding"
      className="flex-1 bg-mauveDark1 pt-4"
      keyboardVerticalOffset={FOOTER_HEIGHT}
    >
      <Link asChild href={{ pathname: "/" }} replace>
        <ModalCloseBtn className="mb-12 ml-4" />
      </Link>

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
                onChangeText={setName}
                placeholder={placeholder}
                value={name}
              />
            </View>
          </Presence>
        </View>
      </ScrollView>
      <CreateFooter
        disabled={!name.trim()}
        hideBackButton
        loading={isPending}
        onContinuePress={submit}
      >
        Save
      </CreateFooter>
    </KeyboardAvoidingView>
  );
}

type FolderWithFunds = RouterOutputs["folder"]["listWithFunds"][number];

function useCreateFolderForm() {
  const [name, setName] = useState("");
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation(
    trpc.folder.create.mutationOptions({
      onMutate: async (newFolder) => {
        await queryClient.cancelQueries(trpc.folder.listWithFunds.pathFilter());
        const previousFolders = queryClient.getQueryData(
          trpc.folder.listWithFunds.queryKey()
        );
        queryClient.setQueryData<FolderWithFunds[]>(
          trpc.folder.listWithFunds.queryKey(),
          (old) => {
            const optimisticFolder: FolderWithFunds = {
              id: -Date.now(),
              name: newFolder.name,
              userId: "",
              createdAt: new Date(),
              updatedAt: null,
              funds: [],
            };
            return [optimisticFolder, ...(old ?? [])];
          }
        );

        return { previousFolders };
      },

      onError: (_err, _newFolder, context) => {
        if (context?.previousFolders) {
          queryClient.setQueryData(
            trpc.folder.listWithFunds.queryKey(),
            context.previousFolders
          );
        }
      },

      onSettled: () => {
        queryClient.invalidateQueries(trpc.folder.list.pathFilter());
        queryClient.invalidateQueries(trpc.folder.listWithFunds.pathFilter());
      },
    })
  );

  const submit = () => {
    if (!name.trim()) {
      return;
    }
    mutation.mutate(
      { name },
      {
        onSuccess: () => {
          router.replace("/");
        },
      }
    );
  };

  return {
    name,
    setName,
    submit,
    isPending: mutation.isPending,
    isDirty: name !== "",
  };
}
