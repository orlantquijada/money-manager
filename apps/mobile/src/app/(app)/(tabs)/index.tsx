import { useQuery } from "@tanstack/react-query";
import { Link } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { trpc } from "@/utils/api";

export default function HomeScreen() {
  const { data: foldersWithFunds, isLoading } = useQuery(
    trpc.folder.listWithFunds.queryOptions()
  );

  return (
    <SafeAreaView className="flex-1 bg-mauveDark1">
      <View className="flex-row items-center justify-between px-4 py-2">
        <Text className="font-satoshi-bold text-2xl text-mauveDark12">
          Funds
        </Text>

        <Link asChild href={{ pathname: "/create-fund" }}>
          <Pressable className="h-10 items-center justify-center rounded-lg bg-mauveDark12 px-4 transition-all active:scale-95">
            <Text className="font-satoshi-medium text-mauveDark1 text-sm">
              + New Fund
            </Text>
          </Pressable>
        </Link>
      </View>

      <ScrollView
        className="flex-1 px-4"
        contentContainerClassName="pb-8 gap-6"
      >
        {isLoading && (
          <Text className="text-center text-mauveDark10">Loading...</Text>
        )}

        {foldersWithFunds?.map((folder) => (
          <View className="gap-3" key={folder.id}>
            <Text className="font-satoshi-medium text-lg text-mauveDark10">
              {folder.name}
            </Text>

            <View className="gap-2">
              {folder.funds.map((fund) => (
                <View className="rounded-xl bg-mauveDark3 p-4" key={fund.id}>
                  <View className="flex-row items-center justify-between">
                    <Text className="font-satoshi-medium text-base text-mauveDark12">
                      {fund.name}
                    </Text>
                    <View className="rounded-full bg-mauveDark6 px-2 py-0.5">
                      <Text className="font-satoshi-medium text-mauveDark11 text-xs">
                        {fund.fundType}
                      </Text>
                    </View>
                  </View>

                  <View className="mt-2 flex-row justify-between">
                    <Text className="font-satoshi-medium text-mauveDark10 text-sm">
                      Budget: ₱{fund.budgetedAmount.toLocaleString()}
                    </Text>
                    <Text className="font-satoshi-medium text-mauveDark10 text-sm">
                      Spent: ₱{fund.totalSpent.toLocaleString()}
                    </Text>
                  </View>

                  <View className="mt-2 h-2 overflow-hidden rounded-full bg-mauveDark5">
                    <View
                      className="h-full rounded-full bg-mauveDark12"
                      style={{
                        width: `${Math.min((fund.totalSpent / fund.budgetedAmount) * 100, 100)}%`,
                      }}
                    />
                  </View>
                </View>
              ))}

              {folder.funds.length === 0 && (
                <Text className="text-center text-mauveDark8 text-sm">
                  No funds in this folder
                </Text>
              )}
            </View>
          </View>
        ))}

        {!isLoading && foldersWithFunds?.length === 0 && (
          <Text className="text-center text-mauveDark10">
            No folders yet. Create a fund to get started!
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
