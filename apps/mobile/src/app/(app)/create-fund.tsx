import { AnimatePresence } from "@alloc/moti";
import { useNavigation, usePreventRemove } from "@react-navigation/native";
import { Link, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Alert, Pressable } from "react-native";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import ChooseFolder from "@/components/create-fund/choose-folder";
import { FOOTER_HEIGHT } from "@/components/create-fund/footer";
import FundInfo from "@/components/create-fund/fund-info";
import NonNegotiableInfo from "@/components/create-fund/non-negotiable-info";
import SpendingInfo from "@/components/create-fund/spending-info";
import { Cross } from "@/icons";
import {
  CreateFundProvider,
  type CreateFundScreens,
  useCreateFundIsDirty,
} from "@/lib/create-fund";

export default function CreateFund() {
  return (
    <CreateFundProvider>
      <CreateFundContent />
    </CreateFundProvider>
  );
}

function CreateFundContent() {
  const { folderId: folderIdParam } = useLocalSearchParams<{
    folderId?: string;
  }>();
  const [screen, setScreen] = useState<CreateFundScreens>("fundInfo");
  const isDirty = useCreateFundIsDirty();
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

  // If folderId is provided via query param, skip the choose-folder step
  const folderIdFromParam = folderIdParam ? Number(folderIdParam) : null;

  return (
    <KeyboardAvoidingView
      behavior="padding"
      className="flex-1 bg-mauveDark1 pt-4"
      keyboardVerticalOffset={FOOTER_HEIGHT}
    >
      <Close />

      <AnimatePresence mode="wait">
        {screen === "fundInfo" && (
          <FundInfo key="fundInfo" setScreen={setScreen} />
        )}

        {screen === "spendingInfo" && (
          <SpendingInfo
            key="spendingInfo"
            presetFolderId={folderIdFromParam}
            setScreen={setScreen}
          />
        )}

        {screen === "nonNegotiableInfo" && (
          <NonNegotiableInfo
            key="nonNegotiableInfo"
            presetFolderId={folderIdFromParam}
            setScreen={setScreen}
          />
        )}

        {screen === "chooseFolder" && (
          <ChooseFolder key="choose-folder" setScreen={setScreen} />
        )}
      </AnimatePresence>
    </KeyboardAvoidingView>
  );
}

function Close() {
  return (
    <Link asChild href={{ pathname: "/" }} replace>
      <Pressable className="mb-12 ml-4 flex size-8 items-center justify-center rounded-full bg-mauveDark12 transition-all active:scale-90">
        <Cross />
      </Pressable>
    </Link>
  );
}
