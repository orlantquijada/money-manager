import { FlatList, View } from "react-native"
import { FundWithMeta } from "~/types"

import { getTotalBudgetedAmount } from "~/utils/functions"
import { useHomeTabRoute } from "~/utils/hooks/useHomeTabRoute"
import { trpc } from "~/utils/trpc"

import Budget from "../Budget"

export default function FoldersList() {
  const folders = useFolders()
  const route = useHomeTabRoute("Budgets")
  return (
    <FlatList
      data={folders.data}
      showsVerticalScrollIndicator={false}
      // ListHeaderComponent={
      //   <Text className="font-satoshi-medium text-mauve12 mb-4 text-xl">
      //     Budgets
      //   </Text>
      // }
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

        const funds: FundWithMeta[] = folder.funds as FundWithMeta[]
        for (const fund of funds) {
          fund.totalBudgetedAmount = getTotalBudgetedAmount(fund)
          totalSpent +=
            fund.totalBudgetedAmount < fund.totalSpent
              ? fund.totalBudgetedAmount
              : fund.totalSpent
          totalBudget += fund.totalBudgetedAmount
        }

        return {
          ...folder,
          funds,
          amountLeft: totalBudget - totalSpent,
        }
      })
    },
  })
}
