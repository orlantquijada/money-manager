import { View, Text } from "react-native"
import { ScrollView } from "react-native-gesture-handler"
import Presence from "../Presence"
import { CurrencyInput } from "../TextInput"
import Choice from "./Choice"
import Footer from "../CreateFooter"

export default function NonNegotiableInfo({
  onBackPress,
}: {
  onBackPress: () => void
}) {
  return (
    <>
      <ScrollView
        className="p-4 pt-0"
        contentContainerStyle={{ paddingBottom: 16 }}
      >
        <View className="flex gap-y-8">
          <View className="gap-y-[10px]">
            <Presence delayMultiplier={3}>
              <Text className="text-mauveDark12 font-satoshi-medium text-lg">
                How do you intend to budget this fund?
              </Text>
            </Presence>

            <View className="flex w-3/5">
              <Presence delayMultiplier={4}>
                <Choice choiceLabel="A" selected className="mb-2">
                  Monthly
                </Choice>
              </Presence>
            </View>
          </View>

          <Presence delayMultiplier={6}>
            <View className="gap-[10px]">
              <Text className="text-mauveDark12 font-satoshi-medium text-lg">
                How much wil you allocate?
              </Text>
              <CurrencyInput />
            </View>
          </Presence>
        </View>
      </ScrollView>
      <Footer onBackPress={onBackPress}>Continue</Footer>
    </>
  )
}
