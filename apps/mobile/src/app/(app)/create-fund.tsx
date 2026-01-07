import { AnimatePresence } from "@alloc/moti";
import { useNavigation, usePreventRemove } from "@react-navigation/native";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Alert } from "react-native";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ChooseFolder from "@/components/create-fund/choose-folder";
import FundInfo from "@/components/create-fund/fund-info";
import NonNegotiableInfo from "@/components/create-fund/non-negotiable-info";
import SpendingInfo from "@/components/create-fund/spending-info";
import { GlassCloseButton } from "@/components/glass-button-icon";
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

const BUTTON_HEIGHT = 48;
const PADDING_Y = 16 * 2;

function CreateFundContent() {
  const { folderId: folderIdParam } = useLocalSearchParams<{
    folderId?: string;
  }>();
  const [screen, setScreen] = useState<CreateFundScreens>("fundInfo");
  const isDirty = useCreateFundIsDirty();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const footerHeight = insets.bottom + BUTTON_HEIGHT + PADDING_Y;

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
      className="relative flex-1 bg-background"
      keyboardVerticalOffset={footerHeight}
    >
      <GlassCloseButton className="absolute top-4 right-4 z-10" />

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
