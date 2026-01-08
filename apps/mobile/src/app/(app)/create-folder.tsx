import { useNavigation, usePreventRemove } from "@react-navigation/native";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { RouterOutputs } from "api";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { Alert, ScrollView } from "react-native";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import CreateFooter from "@/components/create-fund/footer";
import FadingEdge, { useOverflowFadeEdge } from "@/components/fading-edge";
import { GlassCloseButton } from "@/components/glass-button";
import Presence from "@/components/presence";
import TextInput from "@/components/text-input";
import { useThemeColor } from "@/components/theme-provider";
import { StyledLeanText, StyledLeanView } from "@/config/interop";
import { FOLDER_NAME_PLACEHOLDERS } from "@/lib/create-fund";
import { trpc } from "@/utils/api";
import { choice } from "@/utils/random";

export default function CreateFolder() {
  const { name, setName, submit, isPending, isDirty } = useCreateFolderForm();
  const placeholder = useMemo(() => choice(FOLDER_NAME_PLACEHOLDERS), []);
  const navigation = useNavigation();
  const backgroundColor = useThemeColor("background");
  const { fadeProps, handleScroll } = useOverflowFadeEdge();

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
      className="relative flex-1 bg-background"
    >
      <GlassCloseButton className="absolute top-4 left-4 z-10" />

      <FadingEdge fadeColor={backgroundColor} {...fadeProps}>
        <ScrollView
          contentContainerClassName="px-4 pt-20 pb-safe-offset-4 flex-1"
          onScroll={handleScroll}
        >
          <StyledLeanView className="flex gap-y-8">
            <Presence delayMultiplier={3}>
              <StyledLeanView className="gap-2.5">
                <StyledLeanText className="font-satoshi-medium text-foreground text-lg">
                  What&apos;s the name of your folder?
                </StyledLeanText>
                <TextInput
                  onChangeText={setName}
                  placeholder={placeholder}
                  value={name}
                />
              </StyledLeanView>
            </Presence>
          </StyledLeanView>
        </ScrollView>
      </FadingEdge>
      <CreateFooter
        disabled={!name.trim()}
        hideBackButton
        isFinalAction
        loading={isPending}
        onContinuePress={submit}
        variant="text"
      >
        Save Folder
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
          setName("");
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
