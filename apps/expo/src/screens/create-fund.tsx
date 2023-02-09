import { useState } from "react"
import { View, Pressable } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { AnimatePresence } from "moti"

import { useRootStackNavigation } from "~/utils/hooks/useRootStackNavigation"
import { usePrevious } from "~/utils/hooks/usePrevious"

import { FormProvider } from "~/components/create-fund/context"
import SpendingInfo from "~/components/create-fund/SpendingInfo"
import FundInfo from "~/components/create-fund/FundInfo"
import NonNegotiableInfo from "~/components/create-fund/NonNegotiableInfo"
import TargetsInfo from "~/components/create-fund/TargetsInfo"
import ChooseFolder from "~/components/create-fund/ChooseFolder"

import CrossIcon from "../../assets/icons/cross.svg"

export default function CreateFund() {
  const [screen, setScreen] = useCreateFundScreens()
  const prevScreen = usePrevious(screen)

  return (
    <SafeAreaView className="bg-mauveDark1 flex-1 pt-4">
      <View className="mb-8 pl-4">
        <Close />
      </View>

      <FormProvider>
        <AnimatePresence exitBeforeEnter>
          {screen === "fundInfo" && (
            <FundInfo setScreen={setScreen} key="fundInfo" />
          )}
          {screen === "spendingInfo" && (
            <SpendingInfo
              setScreen={setScreen}
              onBackPress={() => setScreen("fundInfo")}
              key="spendingInfo"
            />
          )}
          {screen === "nonNegotiableInfo" && (
            <NonNegotiableInfo
              key="nonNegotiableInfo"
              onBackPress={() => setScreen("fundInfo")}
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
                if (prevScreen) setScreen(prevScreen)
              }}
            />
          )}
        </AnimatePresence>
      </FormProvider>
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
export type CreateFundScreens =
  | "fundInfo"
  | "spendingInfo"
  | "targetsInfo"
  | "nonNegotiableInfo"
  | "chooseFolder"
function useCreateFundScreens() {
  return useState<CreateFundScreens>("fundInfo")
}
export type setScreen = ReturnType<typeof useCreateFundScreens>[1]
