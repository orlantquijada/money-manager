import { useCallback, useRef } from "react"
import { View, Text, Pressable } from "react-native"
import { useIsFocused } from "@react-navigation/native"
import { FlashList } from "@shopify/flash-list"
import { SafeAreaView } from "react-native-safe-area-context"

import Folder from "~/components/Folder"
import Presence from "~/components/Presence"
import BottomSheetModal from "~/components/BottomSheet"
import DashboardCreateBottomSheet from "~/components/dashboard/CreateBottomSheet"

import Plus from "../../assets/icons/plus.svg"
import Stripes from "../../assets/icons/stripes.svg"

export default function Home2() {
  const focused = useIsFocused()

  const bottomSheetModalRef = useRef<BottomSheetModal>(null)
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present()
  }, [])

  return (
    <SafeAreaView className="bg-violet1 flex-1">
      <View className="h-full w-full flex-1 px-4">
        {/* header */}
        <View className="w-full flex-row items-center justify-between pt-12">
          <Text className="font-satoshi-medium text-mauve12 text-3xl">
            Dashboard
          </Text>
          <Pressable hitSlop={40} onPress={handlePresentModalPress}>
            <Plus className="bg-mauve12" />
          </Pressable>
        </View>

        <View className="bg-mauve12 relative mt-6 items-center justify-center overflow-hidden rounded-2xl p-6">
          <View className="border-mauve11/20 absolute inset-0 z-0 translate-x-56 overflow-hidden border-l-2">
            <Stripes />
          </View>

          <Text className="font-satoshi text-mauve8 text-sm">
            Total Spent this month
          </Text>
          <Text className="font-satoshi-bold text-mauve1 text-2xl">
            <Text className="font-satoshi text-mauve8">₱</Text>
            2,539.50
          </Text>
        </View>

        <FlashList
          data={[
            { name: "Folder 1", amountLeft: 241.5 },
            { name: "Bills", amountLeft: 3500 },
            { name: "Quality of Life", amountLeft: 83 },
          ]}
          showsVerticalScrollIndicator={false}
          estimatedItemSize={5}
          ListHeaderComponent={
            <Text className="font-satoshi-medium text-mauve12 mt-8 mb-4 text-xl">
              Budgets
            </Text>
          }
          ItemSeparatorComponent={() => <View className="h-2" />}
          contentContainerStyle={{ paddingBottom: 40 }}
          keyExtractor={({ name }) => name}
          renderItem={({ index, item }) => (
            <Presence
              delayMultiplier={index + 1}
              key={
                focused
                  ? (new Date().getTime() + index).toString()
                  : (new Date().getTime() + index).toString()
              }
            >
              <Folder name={item.name} amountLeft={item.amountLeft} />
            </Presence>
          )}
        />

        <DashboardCreateBottomSheet ref={bottomSheetModalRef} />
      </View>
    </SafeAreaView>
  )
}
