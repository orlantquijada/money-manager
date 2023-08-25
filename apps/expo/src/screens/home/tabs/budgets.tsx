import FoldersList from "~/components/dashboard/FoldersList"
import { FundWithMeta } from "~/types"
import { getTotalBudgetedAmount } from "~/utils/functions"
import { trpc } from "~/utils/trpc"

export default function BudgetsTab() {
  const folders = useFolders()

  // TODO: skeleton (?)
  if (folders.status !== "success") return null

  return <FoldersList folders={folders.data} />
}

function useFolders() {
  return trpc.folder.listWithFunds.useQuery(undefined, {
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
  })
}
