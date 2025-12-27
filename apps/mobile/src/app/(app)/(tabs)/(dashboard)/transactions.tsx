import { ScrollView, Text } from "react-native";

export default function TransactionsScreen() {
  return (
    <ScrollView className="flex-1 px-4" contentContainerClassName="pb-8">
      <Text className="text-center text-mauve10">
        Transactions will appear here
      </Text>
    </ScrollView>
  );
}
