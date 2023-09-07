import { FlatList, View } from "react-native"
import { FolderWithMeta } from "~/types"

import { useHomeTabRoute } from "~/utils/hooks/useHomeTabRoute"

import Budget from "../Budget"

export default function FoldersList({
  folders,
}: {
  folders: FolderWithMeta[]
}) {
  const route = useHomeTabRoute("Budgets")
  return (
    <FlatList
      data={folders}
      showsVerticalScrollIndicator={false}
      // ListHeaderComponent={
      //   <Text className="font-satoshi-medium text-mauve12 mb-4 text-xl">
      //     Budgets
      //   </Text>
      // }
      ItemSeparatorComponent={() => <View className="h-2" />}
      // contentContainerStyle={{ paddingBottom: 40, paddingTop: 80 }}
      contentContainerStyle={{ paddingBottom: 40, paddingTop: 20 }}
      style={{ overflow: "visible" }}
      keyExtractor={({ name }, index) => name + index}
      renderItem={({ item }) => (
        <Budget
          folderName={item.name}
          folderId={item.id}
          // amountLeft={Math.random() * 1000}
          amountLeft={item.amountLeft}
          funds={item.funds}
          // defaultOpen={index === 0}
          defaultOpen
          isRecentlyAdded={
            route.params?.recentlyAddedToFolderId
              ? route.params.recentlyAddedToFolderId === item.id
              : undefined
          }
        />
      )}
    />
  )
}
