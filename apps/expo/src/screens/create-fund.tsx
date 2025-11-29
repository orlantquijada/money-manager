import { AnimatePresence } from "moti";
import { useState } from "react";
import { Pressable, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ChooseFolder from "~/components/create-fund/ChooseFolder";
import { FormProvider } from "~/components/create-fund/context";
import FundInfo from "~/components/create-fund/FundInfo";
import NonNegotiableInfo from "~/components/create-fund/NonNegotiableInfo";
import SpendingInfo from "~/components/create-fund/SpendingInfo";
import TargetsInfo from "~/components/create-fund/TargetsInfo";
import { usePrevious } from "~/utils/hooks/usePrevious";
import { useRootStackNavigation } from "~/utils/hooks/useRootStackNavigation";

import CrossIcon from "../../assets/icons/cross.svg";

export default function CreateFund() {
  const [screen, setScreen] = useCreateFundScreens();
  const prevScreen = usePrevious(screen);

  return (
    <SafeAreaView className="flex-1 bg-mauveDark1 pt-4">
      <View className="mb-8 pl-4">
        <Close />
      </View>

      <FormProvider>
        <AnimatePresence exitBeforeEnter>
          {screen === "fundInfo" && (
            <FundInfo key="fundInfo" setScreen={setScreen} />
          )}
          {screen === "spendingInfo" && (
            <SpendingInfo
              key="spendingInfo"
              onBackPress={() => setScreen("fundInfo")}
              setScreen={setScreen}
            />
          )}
          {screen === "nonNegotiableInfo" && (
            <NonNegotiableInfo
              key="nonNegotiableInfo"
              onBackPress={() => setScreen("fundInfo")}
              setScreen={setScreen}
            />
          )}
          {screen === "targetsInfo" && (
            <TargetsInfo
              key="targetsInfo"
              onBackPress={() => setScreen("fundInfo")}
            />
          )}
          {screen === "chooseFolder" && (
            <ChooseFolder
              key="targetsInfo"
              onBackPress={() => {
                if (prevScreen) {
                  setScreen(prevScreen);
                }
              }}
            />
          )}
        </AnimatePresence>
      </FormProvider>
    </SafeAreaView>
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
export type CreateFundScreens =
  | "fundInfo"
  | "spendingInfo"
  | "targetsInfo"
  | "nonNegotiableInfo"
  | "chooseFolder";
function useCreateFundScreens() {
  return useState<CreateFundScreens>("fundInfo");
}
export type setScreen = ReturnType<typeof useCreateFundScreens>[1];
