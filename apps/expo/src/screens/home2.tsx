import { FlashList } from "@shopify/flash-list"
import { View, Text, SafeAreaView } from "react-native"

import Folder from "~/components/Folder"

import Plus from "../../assets/icons/plus.svg"
import Stripes from "../../assets/icons/stripes.svg"

export default function Home2() {
  return (
    <SafeAreaView className="bg-violet1">
      <View className="h-full w-full p-4 pb-0">
        {/* header */}
        <View className="w-full flex-row items-center justify-between pt-20">
          <Text className="font-satoshi-medium text-mauve12 text-3xl">
            Dashboard
          </Text>
          <Plus className="bg-mauve12" />
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
          renderItem={(p) => (
            <Folder name={p.item.name} amountLeft={p.item.amountLeft} />
          )}
        />
      </View>
    </SafeAreaView>
  )
}
