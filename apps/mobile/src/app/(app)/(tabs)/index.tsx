import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { Link } from "expo-router";
import { useRef } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  return (
    <SafeAreaView className="bg-sky-400">
      <View className="flex-row justify-between">
        <View>
          <Text className="bg-red-500">Hello World</Text>
          <Link href={{ pathname: "/modal" }}>
            <Text className="bg-red-500">text</Text>
          </Link>
        </View>

        <BottomSheetModal ref={bottomSheetModalRef}>
          <BottomSheetView style={styles.contentContainer}>
            <View className="h-[50vh] w-screen">
              <Text>Awesome 🎉</Text>
            </View>
          </BottomSheetView>
        </BottomSheetModal>

        <Pressable
          className="h-10 min-w-20 items-center justify-center rounded-md border px-2 transition-all active:scale-90"
          onPress={() => {
            bottomSheetModalRef.current?.present();
          }}
        >
          <Text>add</Text>
        </Pressable>

        <Link asChild href={{ pathname: "/create-fund" }}>
          <Pressable className="h-10 min-w-20 items-center justify-center rounded-md border px-2 transition-all active:scale-90">
            <Text>add</Text>
          </Pressable>
        </Link>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    backgroundColor: "grey",
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
  },
});
