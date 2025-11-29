import { LinearGradient } from "expo-linear-gradient";
import { View } from "moti";
import { TransactionsList } from "~/components/TransactionsList";
import { violet } from "~/utils/colors";
import { groupTransactionByDate as groupTransactionsByDate } from "~/utils/functions";
import { trpc } from "~/utils/trpc";

export default function TransactionsTab() {
  const transactions = useTransactionsList();
  if (transactions.status !== "success") {
    return null;
  }

  return (
    <View className="relative flex-1 pt-5">
      <TransactionsList transactions={transactions.data} />

      <LinearGradient
        // violet1 with 0 opacity
        className="absolute right-0 bottom-0 z-10 h-6 w-full"
        colors={["hsla(255, 65.0%, 99.4%, 0)", violet.violet1]}
      />
    </View>
  );
}

function useTransactionsList() {
  return trpc.transaction.allThisMonth.useQuery(undefined, {
    select: (transactions) => groupTransactionsByDate(transactions),
  });
}
