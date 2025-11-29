import { FlatList, View } from "react-native";
import type { FolderWithMeta } from "~/types";

import { useHomeTabRoute } from "~/utils/hooks/useHomeTabRoute";

import Budget from "../Budget";

export default function FoldersList({
  folders,
}: {
  folders: FolderWithMeta[];
}) {
  const route = useHomeTabRoute("Budgets");
  return (
    <FlatList
      contentContainerStyle={{ paddingBottom: 40, paddingTop: 20 }}
      data={folders}
      // ListHeaderComponent={
      //   <Text className="font-satoshi-medium text-mauve12 mb-4 text-xl">
      //     Budgets
      //   </Text>
      // }
      ItemSeparatorComponent={() => <View className="h-2" />}
      // contentContainerStyle={{ paddingBottom: 40, paddingTop: 80 }}
      keyExtractor={({ name }, index) => name + index}
      renderItem={({ item }) => (
        <Budget
          amountLeft={item.amountLeft}
          defaultOpen
          // amountLeft={Math.random() * 1000}
          folderId={item.id}
          folderName={item.name}
          // defaultOpen={index === 0}
          funds={item.funds}
          isRecentlyAdded={
            route.params?.recentlyAddedToFolderId
              ? route.params.recentlyAddedToFolderId === item.id
              : undefined
          }
        />
      )}
      showsVerticalScrollIndicator={false}
      style={{ overflow: "visible" }}
    />
  );
}
