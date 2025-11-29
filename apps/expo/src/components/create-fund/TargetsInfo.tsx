import { Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import CreateFooter from "../CreateFooter";
import Presence from "../Presence";
import TextInput from "../TextInput";
import Choice from "./Choice";

export default function TargetsInfo({
  onBackPress,
}: {
  onBackPress: () => void;
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
              <Text className="font-satoshi-medium text-lg text-mauveDark12">
                Do you want this budget to have a deadline?
              </Text>
            </Presence>

            <View className="flex w-3/5">
              <Presence delayMultiplier={4}>
                <Choice choiceLabel="A" className="mb-2" selected>
                  Yes
                </Choice>
              </Presence>
              <Presence delayMultiplier={5}>
                <Choice choiceLabel="B" className="mb-2">
                  No
                </Choice>
              </Presence>
            </View>
          </View>

          <Presence delayMultiplier={6}>
            <View className="gap-[10px]">
              <Text className="font-satoshi-medium text-lg text-mauveDark12">
                How much wil you allocate?
              </Text>
              <TextInput placeholder="new-fund" />
            </View>
          </Presence>
        </View>
      </ScrollView>
      <CreateFooter onBackPress={onBackPress}>Continue</CreateFooter>
    </>
  );
}
