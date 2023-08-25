import { View } from "moti"
import { TransactionsList } from "~/components/TransactionsList"
import { groupTransactionByDate as groupTransactionsByDate } from "~/utils/functions"
import { trpc } from "~/utils/trpc"

export default function TransactionsTab() {
  const transactions = useTransactionsList()
  if (transactions.status !== "success") return null

  return (
    <View className="relative flex-1">
      <TransactionsList transactions={transactions.data} />
    </View>
  )
}

function useTransactionsList() {
  return trpc.transaction.allThisMonth.useQuery(undefined, {
    select: (transactions) => groupTransactionsByDate(transactions),
  })
}
