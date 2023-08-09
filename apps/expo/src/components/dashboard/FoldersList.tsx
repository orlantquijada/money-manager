import { ComponentProps } from "react"
import { View } from "react-native"
import Animated from "react-native-reanimated"

import { getTotalBudgetedAmount } from "~/utils/functions"
import { useHomeTabRoute } from "~/utils/hooks/useHomeTabRoute"
import { trpc } from "~/utils/trpc"

import Budget from "../Budget"

// TODO: di mn diay ni need i flatlist kay di mn jd siya in ana ka daghan
export default function FoldersList({
  onScroll,
}: {
  onScroll?: ComponentProps<typeof Animated.FlatList>["onScroll"]
}) {
  const folders = useFolders()
  const route = useHomeTabRoute("Budgets")
  return (
    <Animated.FlatList
      data={folders.data}
      showsVerticalScrollIndicator={false}
      // ListHeaderComponent={
      //   <Text className="font-satoshi-medium text-mauve12 mb-4 text-xl">
      //     Budgets
      //   </Text>
      // }
      onScroll={onScroll}
      ItemSeparatorComponent={() => <View className="h-2" />}
      // contentContainerStyle={{ paddingBottom: 40, paddingTop: 80 }}
      contentContainerStyle={{ paddingBottom: 40 }}
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

function useFolders() {
  return trpc.folder.listWithFunds.useQuery(undefined, {
    select: (folder) => {
      return folder.map((folder) => {
        let totalSpent = 0
        let totalBudget = 0

        for (const fund of folder.funds) {
          const budgetedAmount = getTotalBudgetedAmount(fund)
          totalSpent +=
            budgetedAmount < fund.totalSpent ? budgetedAmount : fund.totalSpent
          totalBudget += budgetedAmount
        }

        return {
          ...folder,
          amountLeft: totalBudget - totalSpent,
        }
      })
    },
  })
}
