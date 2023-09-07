import { endOfMonth, startOfMonth } from "date-fns"
import { View } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import FoldersList from "~/components/dashboard/FoldersList"
import { FundWithMeta } from "~/types"
import { violet } from "~/utils/colors"
import { getTotalBudgetedAmount } from "~/utils/functions"
import { trpc } from "~/utils/trpc"

export default function BudgetsTab() {
  const folders = useFolders()

  // TODO: skeleton (?)
  if (folders.status !== "success") return null

  return (
    <View className="relative flex-1">
      <LinearGradient
        // violet1 with 0 opacity
        colors={[violet.violet1, "hsla(255, 65.0%, 99.4%, 0)"]}
        className="absolute top-0 right-0 z-10 h-8 w-full"
      />
      <FoldersList folders={folders.data} />
      <LinearGradient
        // violet1 with 0 opacity
        colors={["hsla(255, 65.0%, 99.4%, 0)", violet.violet1]}
        className="absolute bottom-0 right-0 z-10 h-8 w-full"
      />
    </View>
  )
}

// TODO: pwede mn diay nga funds.listFromUser gamiton ani nya extra query para folders list nya i-map lng
function useFolders() {
  const now = new Date()
  return trpc.folder.listWithFunds.useQuery(
    { startDate: startOfMonth(now), endDate: endOfMonth(now) },
    {
      select: (folder) => {
        return folder.map((folder) => {
          let totalSpent = 0
          let totalBudget = 0

          const funds = folder.funds as FundWithMeta[]
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
    },
  )
}
