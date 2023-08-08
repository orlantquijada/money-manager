import { Text, View } from "react-native"
import { getTotalBudgetedAmount } from "~/utils/functions"

import { useRootBottomTabRoute } from "~/utils/hooks/useRootBottomTabRoute"
import { trpc } from "~/utils/trpc"

import Budget from "../Budget"
import Presence from "../Presence"

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
  const route = useRootBottomTabRoute("Home")

  return (
    <View className="pt-20">
      <Text className="font-satoshi-medium text-mauve12 mb-4 text-xl">
        Budgets
      </Text>

      <View className="space-y-2">
        {folders.data?.map((item, index) => (
          <Presence delayMultiplier={index + 1} delay={60} key={item.id}>
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
          </Presence>
        ))}
      </View>
    </View>
  )
}
