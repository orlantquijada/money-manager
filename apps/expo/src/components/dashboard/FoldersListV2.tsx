import { Text, View } from "react-native"

import { getTotalBudgetedAmount } from "~/utils/functions"
import { useHomeTabRoute } from "~/utils/hooks/useHomeTabRoute"
import { trpc } from "~/utils/trpc"

import Budget from "../Budget"

export default function FoldersList() {
  const folders = trpc.folder.listWithFunds.useQuery(undefined, {
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
  const route = useHomeTabRoute("Budgets")

  return (
    <View className="pt-20">
      <Text className="font-satoshi-medium text-mauve12 mb-4 text-xl">
        Budgets
      </Text>

      <View className="space-y-2">
        {folders.data?.map((item) => (
          <Budget
            key={item.id}
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
        ))}
      </View>
    </View>
  )
}
