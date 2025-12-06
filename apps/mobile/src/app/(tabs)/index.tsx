import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  return (
    <SafeAreaView className="bg-sky-400">
      <Text className="bg-red-500">Hello World</Text>
    </SafeAreaView>
  );
}
