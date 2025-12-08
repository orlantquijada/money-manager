import { Link } from "expo-router";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  return (
    <SafeAreaView className="bg-mauveDark1 bg-sky-400">
      <Text className="bg-red-500">Hello World</Text>
      <Link href={{ pathname: "/modal" }}>
        <Text className="bg-red-500">text</Text>
      </Link>
    </SafeAreaView>
  );
}
