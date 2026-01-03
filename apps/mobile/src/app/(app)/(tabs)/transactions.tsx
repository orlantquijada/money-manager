import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AnimatedTabScreen } from "@/components/animated-tab-screen";

export default function Transactions() {
  return (
    <AnimatedTabScreen index={2}>
      <SafeAreaView>
        <Text>transactions</Text>
      </SafeAreaView>
    </AnimatedTabScreen>
  );
}
