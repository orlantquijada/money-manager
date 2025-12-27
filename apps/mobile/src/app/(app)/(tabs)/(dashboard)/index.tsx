import { useQuery } from "@tanstack/react-query";
import { ScrollView, Text, View } from "react-native";
import { trpc } from "@/utils/api";

export default function BudgetsScreen() {
  const { data: foldersWithFunds, isLoading } = useQuery(
    trpc.folder.listWithFunds.queryOptions()
  );

  return (
    <ScrollView className="flex-1 px-4" contentContainerClassName="pb-8 gap-6">
      {isLoading && (
        <Text className="text-center text-mauveDark3">Loading...</Text>
      )}

      {foldersWithFunds?.map((folder) => (
        <View className="gap-3" key={folder.id}>
          <Text className="font-satoshi-medium text-lg text-mauveDark3">
            {folder.name}
          </Text>

          <View className="gap-2">
            {folder.funds.map((fund) => (
              <View className="rounded-xl bg-mauveDark10 p-4" key={fund.id}>
                <View className="flex-row items-center justify-between">
                  <Text className="font-satoshi-medium text-base text-mauveDark1">
                    {fund.name}
                  </Text>
                  <View className="rounded-full bg-mauveDark6 px-2 py-0.5">
                    <Text className="font-satoshi-medium text-mauveDark2 text-xs">
                      {fund.fundType}
                    </Text>
                  </View>
                </View>

                <View className="mt-2 flex-row justify-between">
                  <Text className="font-satoshi-medium text-mauveDark3 text-sm">
                    Budget: ₱{fund.budgetedAmount.toLocaleString()}
                  </Text>
                  <Text className="font-satoshi-medium text-mauveDark3 text-sm">
                    Spent: ₱{fund.totalSpent.toLocaleString()}
                  </Text>
                </View>

                <View className="mt-2 h-2 overflow-hidden rounded-full bg-mauveDark5">
                  <View
                    className="h-full rounded-full bg-mauveDark1"
                    style={{
                      width: `${Math.min((fund.totalSpent / fund.budgetedAmount) * 100, 100)}%`,
                    }}
                  />
                </View>
              </View>
            ))}

            {folder.funds.length === 0 && (
              <Text className="text-center text-mauveDark4 text-sm">
                No funds in this folder
              </Text>
            )}
          </View>
        </View>
      ))}

      {!isLoading && foldersWithFunds?.length === 0 && (
        <Text className="text-center text-mauveDark3">
          No folders yet. Create a fund to get started!
        </Text>
      )}
    </ScrollView>
  );
}
