import { FlatList, Text, View } from "react-native"

import { useRootBottomTabRoute } from "~/utils/hooks/useRootBottomTabRoute"
import { trpc } from "~/utils/trpc"

import Budget from "../Budget"
import Presence from "../Presence"

export default function FoldersList() {
  const folders = trpc.folder.listWithFunds.useQuery()
  const route = useRootBottomTabRoute("Home")

  return (
    <FlatList
      data={folders.data}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={
        <Text className="font-satoshi-medium text-mauve12 mt-8 mb-4 text-xl">
          Budgets
        </Text>
      }
      ItemSeparatorComponent={() => <View className="h-2" />}
      contentContainerStyle={{ paddingBottom: 40 }}
      keyExtractor={({ name }, index) => name + index}
      renderItem={({ item, index }) => (
        <Presence delayMultiplier={index + 1} delay={60}>
          <Budget
            folderName={item.name}
            folderId={item.id}
            // amountLeft={Math.random() * 1000}
            amountLeft={1000}
            funds={item.funds}
            defaultOpen={index === 0}
            isRecentlyAdded={
              route.params?.recentlyAddedToFolderId
                ? route.params.recentlyAddedToFolderId === item.id
                : undefined
            }
          />
        </Presence>
      )}
    />
  )
}
