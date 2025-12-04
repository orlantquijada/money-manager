import { useNavigation } from "@react-navigation/native";
import type { Fund } from "api";
import { Text, View } from "react-native";
import SafeAreaView from "~/components/SafeAreaView";
import ScaleDownPressable from "~/components/ScaleDownPressable";
import { TransactionsList } from "~/components/TransactionsList";
import { groupTransactionByDate } from "~/utils/functions";
import { useRootStackRoute } from "~/utils/hooks/useRootStackRoute";
import { trpc } from "~/utils/trpc";
// import Calendar from "../../assets/icons/hero-icons/calendar.svg"
// import Calendar from "../../assets/icons/calendar-dates.svg";
// import Menu from "../../assets/icons/more-horiz.svg";
// import Search from "../../assets/icons/search-duo.svg";
// import TriangleLeft from "../../assets/icons/triangle-left.svg";

// NOTE: kind of weird na ang transaction record title kay same ug name sa
// fund name murag redundant na nuon – pwede sguro nga note ang ibutang or ang store instead
// plus try to add a date

// TODO: empty state

// TODO: search

export default function TransactionsPage() {
  const route = useRootStackRoute("TransactionsList");
  const transactions = useTransactions(route.params.fundId);
  const navigation = useNavigation();

  return (
    <SafeAreaView className="flex-1 bg-violet1">
      <View className="px-4">
        <View className="mb-8 flex-row items-center justify-between android:pt-4">
          <ScaleDownPressable
            onPress={() => {
              navigation.goBack();
            }}
            opacity={0.6}
            scale={1}
          >
            <View className="flex-row items-center">
              {/* <TriangleLeft color={mauve.mauve8} height={15} width={15} /> */}
              <Text className="font-satoshi-bold text-mauve8 text-sm">
                Transactions
              </Text>
            </View>
            <Text className="font-satoshi-bold text-mauve12 text-xl">
              {route.params.fundName}
            </Text>
          </ScaleDownPressable>

          <View className="flex-row">
            <View className="mr-2">
              {/* <Menu */}
              {/*   color={mauve.mauve11} */}
              {/*   height={24} */}
              {/*   strokeWidth={3} */}
              {/*   width={24} */}
              {/* /> */}
            </View>
            {/* TODO: stroke width not the same */}
            {/* <Calendar */}
            {/*   color={mauve.mauve11} */}
            {/*   height={24} */}
            {/*   strokeWidth={3} */}
            {/*   width={24} */}
            {/* /> */}
          </View>
        </View>

        <View className="mb-4">
          <View className="h-8 justify-center rounded-lg bg-mauve3 px-2">
            <View className="flex-row items-center">
              {/* <Search color={mauve.mauve8} height={16} width={16} /> */}

              <Text className="ml-1 font-satoshi-medium text-mauve8 text-sm">
                Search
              </Text>
            </View>
          </View>
        </View>

        <TransactionsList
          transactions={
            transactions.status === "success" ? transactions.data : []
          }
        />
      </View>
    </SafeAreaView>
  );
}

function useTransactions(fundId: Fund["id"]) {
  return trpc.transaction.allThisMonth.useQuery(
    { fundId },
    {
      select: (transactions) => groupTransactionByDate(transactions),
    }
  );
}
