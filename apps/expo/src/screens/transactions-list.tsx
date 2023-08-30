import { Text, View } from "react-native"
import { useNavigation } from "@react-navigation/native"

import { groupTransactionByDate } from "~/utils/functions"
import { trpc } from "~/utils/trpc"
import { mauve } from "~/utils/colors"
import { useRootStackRoute } from "~/utils/hooks/useRootStackRoute"

import SafeAreaView from "~/components/SafeAreaView"
import { TransactionsList } from "~/components/TransactionsList"
import ScaleDownPressable from "~/components/ScaleDownPressable"

import { Fund } from ".prisma/client"

import Menu from "../../assets/icons/more-horiz.svg"
// import Calendar from "../../assets/icons/hero-icons/calendar.svg"
import Calendar from "../../assets/icons/calendar-dates.svg"
import Search from "../../assets/icons/search-duo.svg"

// NOTE: kind of weird na ang transaction record title kay same ug name sa
// fund name murag redundant na nuon – pwede sguro nga note ang ibutang or ang store instead
// plus try to add a date

// TODO: empty state

// TODO: search

export default function TransactionsPage() {
  const route = useRootStackRoute("TransactionsList")
  const transactions = useTransactions(route.params.fundId)
  const navigation = useNavigation()

  if (transactions.status !== "success") return null

  return (
    <SafeAreaView className="bg-violet1 flex-1">
      <View className="px-4">
        <View className="android:pt-4 mb-8 flex-row items-center justify-between">
          <ScaleDownPressable
            scale={1}
            opacity={0.6}
            onPress={() => {
              navigation.goBack()
            }}
          >
            <Text className="text-mauve8 font-satoshi-bold text-sm">
              Transactions
            </Text>
            <Text className="font-satoshi-bold text-mauve12 text-xl">
              {route.params.fundName}
            </Text>
          </ScaleDownPressable>

          <View className="flex-row">
            <View className="mr-2">
              <Menu
                height={24}
                width={24}
                strokeWidth={3}
                color={mauve.mauve11}
              />
            </View>
            {/* TODO: stroke width not the same */}
            <Calendar
              height={24}
              width={24}
              strokeWidth={3}
              color={mauve.mauve11}
            />
          </View>
        </View>

        <View className="mb-4">
          <View className="bg-mauve3 h-8 justify-center rounded-lg px-2">
            <View className="flex-row items-center">
              <Search width={16} height={16} color={mauve.mauve8} />

              <Text className="font-satoshi-medium text-mauve8 ml-1 text-sm">
                Search
              </Text>
            </View>
          </View>
        </View>

        <TransactionsList transactions={transactions.data} />
      </View>
    </SafeAreaView>
  )
}

function useTransactions(fundId: Fund["id"]) {
  return trpc.transaction.allThisMonth.useQuery(
    { fundId },
    {
      select: (transactions) => groupTransactionByDate(transactions),
    },
  )
}
