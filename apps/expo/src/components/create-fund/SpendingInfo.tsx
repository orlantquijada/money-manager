import { View, Text } from "react-native"
import { ScrollView } from "react-native-gesture-handler"

import Presence from "../Presence"
import TextInput from "../TextInput"
import Choice from "./Choice"
import CreateFooter from "../CreateFooter"

const DELAY = 40

export default function SpendingInfo({
  onPress,
  onBackPress,
}: {
  onPress: () => void
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
            <Presence delayMultiplier={1} delay={DELAY}>
              <Text className="text-mauveDark12 font-satoshi-medium text-lg">
                How do you intent to budget this fund?
              </Text>
            </Presence>

            <View className="flex w-3/5">
              <Presence delayMultiplier={2} delay={DELAY}>
                <Choice choiceLabel="A" selected className="mb-2">
                  Weekly
                </Choice>
              </Presence>
              <Presence delayMultiplier={3} delay={DELAY}>
                <Choice choiceLabel="B" className="mb-2">
                  Monthly
                </Choice>
              </Presence>

              <Presence delayMultiplier={4} delay={DELAY}>
                <Choice choiceLabel="C">Twice a Month</Choice>
              </Presence>
            </View>
          </View>

          <Presence delayMultiplier={5} delay={DELAY}>
            <View className="gap-[10px]">
              <Text className="text-mauveDark12 font-satoshi-medium text-lg">
                How much wil you allocate?
              </Text>
              <TextInput placeholder="new-fund" />
            </View>
          </Presence>
        </View>
      </ScrollView>
      <CreateFooter onContinuePress={onPress} onBackPress={onBackPress} />
    </>
  )
}
