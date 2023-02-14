import { useCallback, useRef } from "react"
import { View, Text, Pressable } from "react-native"
import { FlashList } from "@shopify/flash-list"
import { SafeAreaView } from "react-native-safe-area-context"

import { trpc } from "~/utils/trpc"
import { useRootBottomTabRoute } from "~/utils/hooks/useRootBottomTabRoute"

import Budget from "~/components/Budget"
import Presence from "~/components/Presence"
import BottomSheetModal from "~/components/BottomSheet"
import DashboardCreateBottomSheet from "~/components/dashboard/CreateBottomSheet"
import { HeaderProgressBar } from "~/components/dashboard/HeaderProgressBar"

import Plus from "../../assets/icons/plus.svg"

export default function Home2() {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null)
  const route = useRootBottomTabRoute("Home")
  const { data } = trpc.folder.listWithFunds.useQuery()

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present()
  }, [])

  return (
    <SafeAreaView className="bg-violet1 relative flex-1">
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

        <HeaderProgressBar progress={Math.random() * 100} />

        <FlashList
          data={data}
          showsVerticalScrollIndicator={false}
          estimatedItemSize={50}
          ListHeaderComponent={
            <Text className="font-satoshi-medium text-mauve12 mt-8 mb-4 text-xl">
              Budgets
            </Text>
          }
          ItemSeparatorComponent={() => <View className="h-2" />}
          contentContainerStyle={{ paddingBottom: 40 }}
          keyExtractor={({ id }) => id.toString() + "folder"}
          renderItem={({ index, item }) => (
            <Presence delayMultiplier={index + 1} delay={40}>
              <Budget
                folderName={item.name}
                folderId={item.id}
                amountLeft={242}
                funds={item.funds}
                // defaultOpen={index === 0}
                forceOpen={
                  route.params?.recentlyAddedToFolderId
                    ? route.params.recentlyAddedToFolderId === item.id
                    : undefined
                }
              />
            </Presence>
          )}
        />

        <DashboardCreateBottomSheet ref={bottomSheetModalRef} />
      </View>
    </SafeAreaView>
  )
}
