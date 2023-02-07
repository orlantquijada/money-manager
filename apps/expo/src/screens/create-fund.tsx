import { useState } from "react"
import { View, Pressable } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { AnimatePresence } from "moti"

import { useRootStackNavigation } from "~/utils/hooks/useRootStackNavigation"

import { FormProvider } from "~/components/create-fund/context"
import SpendingInfo from "~/components/create-fund/SpendingInfo"
import FundInfo from "~/components/create-fund/FundInfo"

import CrossIcon from "../../assets/icons/cross.svg"

export default function CreateFund() {
  const [screen, setScreen] = useState<"fundInfo" | "spendingInfo">("fundInfo")
  return (
    <SafeAreaView className="bg-mauveDark1 flex-1 pt-4">
      <View className="mb-8 pl-4">
        <Close />
      </View>

      <FormProvider>
        <AnimatePresence exitBeforeEnter>
          {screen === "fundInfo" && (
            <FundInfo
              onPress={() => setScreen("spendingInfo")}
              onBackPress={() => setScreen("fundInfo")}
              key="fundInfo"
            />
          )}
          {screen === "spendingInfo" && (
            <SpendingInfo
              onPress={() => setScreen("fundInfo")}
              onBackPress={() => setScreen("fundInfo")}
              key="spendingInfo"
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
