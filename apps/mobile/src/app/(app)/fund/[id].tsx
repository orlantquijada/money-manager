import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Link, useLocalSearchParams } from "expo-router";
import { ScrollView, Text, View } from "react-native";
import ModalCloseBtn from "@/components/modal-close-btn";
import { trpc } from "@/utils/api";

export default function FundDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const fundId = Number(id);

  const { data: transactions, isLoading } = useQuery(
    trpc.transaction.recentByFund.queryOptions(fundId)
  );

  return (
    <View className="flex-1 bg-violet1 pt-4">
      <View className="flex-row items-center justify-between px-4 pb-4">
        <Link asChild href={{ pathname: "/" }} replace>
          <ModalCloseBtn />
        </Link>
        <Text className="font-satoshi-medium text-lg text-violet12">
          Transactions
        </Text>
        <View className="w-8" />
      </View>

      <ScrollView
        className="flex-1 px-4"
        contentContainerClassName="gap-2 pb-8"
      >
        {isLoading && (
          <Text className="text-center text-mauve9">Loading...</Text>
        )}

        {!isLoading && (!transactions || transactions.length === 0) && (
          <Text className="text-center text-mauve9">No transactions yet</Text>
        )}

        {transactions?.map((transaction) => (
          <View
            className="rounded-xl bg-mauve3 p-4"
            key={transaction.id}
            style={{ borderCurve: "continuous" }}
          >
            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <Text
                  className="font-satoshi-medium text-base text-violet12"
                  numberOfLines={1}
                >
                  {transaction.store?.name || "No store"}
                </Text>
                {transaction.note && (
                  <Text
                    className="mt-0.5 font-satoshi text-mauve9 text-sm"
                    numberOfLines={1}
                  >
                    {transaction.note}
                  </Text>
                )}
              </View>
              <View className="items-end">
                <Text className="font-satoshi-medium text-base text-violet12">
                  ₱{Number(transaction.amount).toLocaleString()}
                </Text>
                <Text className="font-satoshi text-mauve9 text-xs">
                  {transaction.date
                    ? format(new Date(transaction.date), "MMM d")
                    : ""}
                </Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
