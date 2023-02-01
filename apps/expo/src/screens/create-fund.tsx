import { View, Pressable } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

import { useRootStackNavigation } from "~/utils/hooks/useRootStackNavigation"

import CrossIcon from "../../assets/icons/cross.svg"
import SpendingInfo from "~/components/create-fund/SpendingInfo"

export default function CreateFund() {
  return (
    <SafeAreaView className="bg-mauveDark1 flex-1 pt-4">
      <View className="mb-8 pl-4">
        <Close />
      </View>

      {/* <FundInfo /> */}
      <SpendingInfo />
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
