import type { Fund } from ".prisma/client";
import { useNavigationState } from "@react-navigation/native";
import clsx from "clsx";
import { MotiText, MotiView } from "moti";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import {
  runOnUI,
  useAnimatedReaction,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { AnimatedText } from "~/components/AnimatedText";
import Pie from "~/components/Pie";
import SafeAreaView from "~/components/SafeAreaView";
import { mauve, pieColors8, saturatedPieColors8, violet } from "~/utils/colors";
import { toCurrency } from "~/utils/functions";
import { transitions } from "~/utils/motion";
import { trpc } from "~/utils/trpc";
// import ChartIcon from "../../assets/icons/chart-column.svg"
import ChartIcon from "../../assets/icons/calendar-dates.svg";
// import ChevronRightIcon from "../../assets/icons/hero-icons/chevron-right.svg"

export default function TransactionsScreen() {
  const { funds, total } = useExpenses();
  const [selectedFund, setSelectedFund] = useState<FundWithTotalSpent>();

  const open = useSharedValue(false);

  useEffect(() => {
    open.value = selectedFund?.id !== undefined;
  }, [selectedFund?.id, open]);

  const [index, routes] = useNavigationState((s) => [s.index, s.routes]);

  if (routes[index]?.name === "AddTransaction") {
    return null;
  }

  return (
    <SafeAreaView className="flex-1 bg-violet1">
      <ScrollView>
        <View className="h-full px-4">
          <View className="mt-8 h-10 w-full flex-row items-center justify-between">
            <Text className="font-satoshi-bold text-mauve12 text-xl">
              {/* Transactions */}
              Expense Structure
            </Text>
            <Pressable className="flex-row items-center justify-center">
              <ChartIcon
                // color={mauveDark.mauve12}
                height={20}
                strokeWidth={3}
                width={20}
              />
              <Text className="ml-2 font-satoshi-medium text-mauve12 text-sm">
                March
              </Text>
            </Pressable>
          </View>

          <View className="mt-8 flex-row items-center justify-center">
            <PieChart
              data={funds}
              selectedFund={selectedFund}
              setSelectedFund={setSelectedFund}
              total={total.data || 1}
            />

            <View className="ml-5 self-start">
              {funds.map((fund, index) => {
                const isCurrentSelected = fund.id === selectedFund?.id;

                return (
                  <MotiView
                    animate={{
                      opacity:
                        selectedFund === undefined || isCurrentSelected
                          ? 1
                          : 0.7,
                      translateX: isCurrentSelected ? -8 : 0,
                    }}
                    className="mb-1 flex-row items-center"
                    key={fund.id}
                    transition={{ translateX: transitions.lessSnappy }}
                  >
                    <MotiView
                      animate={{
                        backgroundColor:
                          selectedFund === undefined || isCurrentSelected
                            ? colors[index]
                            : saturatedColors[index],
                      }}
                      className="mr-2 aspect-square h-2 rounded-full"
                    />

                    <MotiText
                      animate={{
                        color:
                          selectedFund === undefined || isCurrentSelected
                            ? violet.violet12
                            : mauve.mauve10,
                      }}
                      className="font-satoshi-bold text-mauve12"
                    >
                      {fund.name}
                    </MotiText>
                  </MotiView>
                );
              })}
            </View>
          </View>

          <View className="mt-6">
            <View className="flex-row items-center justify-between">
              <Text className="mb-2 font-satoshi-bold text-mauve8 text-xl">
                Top Funds
              </Text>

              <Text className="mb-2 font-satoshi-medium text-mauve8 text-sm">
                View All
              </Text>
            </View>
            {funds.map((fund, index) => {
              const isCurrentSelected = fund.id === selectedFund?.id;

              return (
                <MotiView
                  animate={{
                    opacity:
                      selectedFund === undefined || isCurrentSelected ? 1 : 0.7,
                  }}
                  className={clsx(
                    "flex-row border-transparent border-b py-2.5",
                    index !== funds.length - 1 && "border-b-mauve4"
                  )}
                  key={fund.id}
                >
                  <View className="flex-row">
                    <View className="mr-2.5 h-6 justify-center">
                      <MotiView
                        animate={{
                          backgroundColor:
                            selectedFund === undefined || isCurrentSelected
                              ? colors[index]
                              : saturatedColors[index],
                        }}
                        className="aspect-square h-2 rounded-full"
                      />
                    </View>
                    <View>
                      <View className="flex-row items-center">
                        <MotiText
                          animate={{
                            color:
                              selectedFund === undefined || isCurrentSelected
                                ? violet.violet12
                                : mauve.mauve10,
                          }}
                          className="font-satoshi-bold text-base"
                        >
                          {fund.name}
                        </MotiText>
                      </View>
                      <Text className="font-satoshi-medium text-base text-mauve10">
                        {fund.txnCount}{" "}
                        {fund.txnCount === 1 ? "entry" : "entries"}
                      </Text>
                    </View>
                  </View>
                  <View className="mt-1 ml-auto items-end justify-between">
                    <Text className="font-nunito-bold text-mauve10 text-sm">
                      {toCurrency(fund.totalSpent)}
                    </Text>
                    <Text className="ml-2 font-nunito-medium text-mauve10 text-sm">
                      (
                      {((fund.totalSpent / (total.data || 1)) * 100).toFixed(0)}
                      %)
                    </Text>
                  </View>
                </MotiView>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const colors = pieColors8;
const saturatedColors = saturatedPieColors8;

function PieChart({
  data,
  total,
  selectedFund,
  setSelectedFund,
}: {
  data: FundWithTotalSpent[];
  total: number;
  selectedFund: FundWithTotalSpent | undefined;
  setSelectedFund: (fund: FundWithTotalSpent | undefined) => void;
}) {
  const current = useSharedValue(0);
  const text = useSharedValue("");
  // const [selectedFund, setSelectedFund] = useState<FundWithTotalSpent>()

  useAnimatedReaction(
    () => current.value,
    (c) => {
      text.value = `${c.toFixed(0)}%`;
    }
  );

  useEffect(() => {
    runOnUI(() => {
      current.value = withSpring(
        ((selectedFund?.totalSpent || 0) / total) * 100,
        transitions.snappy
      );
    })();
  }, [current, selectedFund?.totalSpent, total]);

  return (
    <View className="relative items-center justify-center">
      <View className="absolute">
        {selectedFund ? (
          <AnimatedText
            className="font-nunito-bold text-2xl text-violet12"
            text={text}
          />
        ) : null}
      </View>

      <View className="aspect-square h-40">
        <Pie
          data={data}
          onPressSlice={(fund) => {
            setSelectedFund(fund);
          }}
        />
      </View>
    </View>
  );
}

function useExpenses() {
  const total = trpc.transaction.totalThisMonth.useQuery();
  const funds = trpc.fund.list.useQuery(undefined, {
    select: (data) =>
      data
        .filter(({ totalSpent }) => totalSpent)
        .sort((a, b) => b.totalSpent - a.totalSpent),
  });

  const countByFund = trpc.transaction.countByFund.useQuery(undefined, {
    select: (data) => {
      const fundsWithTxnCount: (Exclude<
        (typeof funds)["data"],
        undefined
      >[number] & {
        txnCount: number;
      })[] = [];

      const top5Funds = funds.data?.slice(0, 5) || [];
      const otherFunds = funds.data?.slice(5) || [];

      for (const fund of top5Funds) {
        fundsWithTxnCount.push({
          ...fund,
          txnCount: data.find(({ fundId }) => fund.id === fundId)?._count || 0,
        });
      }

      if (otherFunds.length) {
        let totalSpent = 0;
        let txnCount = 0;

        for (const fund of otherFunds) {
          txnCount +=
            data.find(({ fundId }) => fundId === fund.id)?._count || 0;
          totalSpent += fund.totalSpent;
        }

        const otherFund: (typeof fundsWithTxnCount)[number] = {
          id: -1,
          name: "Others",
          totalSpent,
          txnCount,

          // unused fields
          budgetedAmount: 0,
          fundType: "SPENDING",
          enabled: true,
          folderId: -1,
          timeMode: "MONTHLY",
        };

        fundsWithTxnCount.push(otherFund);
      }

      return fundsWithTxnCount;
    },
  });

  return {
    total,
    funds: countByFund.data || [],
  };
}

type FundWithTotalSpent = Fund & {
  totalSpent: number;
};
