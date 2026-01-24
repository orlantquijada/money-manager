import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
export default function RootLayout() {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
      }}
    >
      <View>
        <Text style={{ fontSize: 24, fontWeight: "bold", color: "black" }}>
          Build Verification Success
        </Text>
        <Text style={{ marginTop: 10, fontSize: 16, color: "gray" }}>
          If you see this, the build works.
        </Text>
      </View>
    </SafeAreaView>
  );
}
