import { useEffect, useState } from "react"
import { View, Text, Pressable, ScrollView } from "react-native"
import clsx from "clsx"
import {
  runOnUI,
  useAnimatedReaction,
  useSharedValue,
  withSpring,
} from "react-native-reanimated"
import { MotiView, MotiText } from "moti"

import Pie from "~/components/Pie"
import { AnimatedText } from "~/components/AnimatedText"
import SafeAreaView from "~/components/SafeAreaView"
import { mauve, pieColors8, saturatedPieColors8, violet } from "~/utils/colors"
import { toCurrency } from "~/utils/functions"
import { trpc } from "~/utils/trpc"
import { transitions } from "~/utils/motion"
import { Fund } from ".prisma/client"

// import ChartIcon from "../../assets/icons/chart-column.svg"
import ChartIcon from "../../assets/icons/calendar-dates.svg"
import { useNavigationState } from "@react-navigation/native"
// import ChevronRightIcon from "../../assets/icons/hero-icons/chevron-right.svg"

export default function TransactionsScreen() {
  const { funds, total } = useExpenses()
  const [selectedFund, setSelectedFund] = useState<FundWithTotalSpent>()

  const open = useSharedValue(false)

  useEffect(() => {
    open.value = selectedFund?.id !== undefined
  }, [selectedFund?.id, open])

  const [index, routes] = useNavigationState((s) => [s.index, s.routes])

  if (routes[index]?.name === "AddTransaction") return null

  return (
    <SafeAreaView className="bg-violet1 flex-1">
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
                width={20}
                strokeWidth={3}
              />
              <Text className="font-satoshi-medium text-mauve12 ml-2 text-sm">
                March
              </Text>
            </Pressable>
          </View>

          <View className="mt-8 flex-row items-center justify-center">
            <PieChart
              data={funds}
              total={total.data || 1}
              selectedFund={selectedFund}
              setSelectedFund={setSelectedFund}
            />

            <View className="ml-5 self-start">
              {funds.map((fund, index) => {
                const isCurrentSelected = fund.id === selectedFund?.id

                return (
                  <MotiView
                    key={fund.id}
                    className="mb-1 flex-row items-center"
                    animate={{
                      opacity:
                        selectedFund === undefined || isCurrentSelected
                          ? 1
                          : 0.7,
                      translateX: isCurrentSelected ? -8 : 0,
                    }}
                    transition={{ translateX: transitions.lessSnappy }}
                  >
                    <MotiView
                      className="mr-2 aspect-square h-2 rounded-full"
                      animate={{
                        backgroundColor:
                          selectedFund === undefined || isCurrentSelected
                            ? colors[index]
                            : saturatedColors[index],
                      }}
                    />

                    <MotiText
                      className="font-satoshi-bold text-mauve12"
                      animate={{
                        color:
                          selectedFund === undefined || isCurrentSelected
                            ? violet.violet12
                            : mauve.mauve10,
                      }}
                    >
                      {fund.name}
                    </MotiText>
                  </MotiView>
                )
              })}
            </View>
          </View>

          <View className="mt-6">
            <View className="flex-row items-center justify-between">
              <Text className="font-satoshi-bold text-mauve8 mb-2 text-xl">
                Top Funds
              </Text>

              <Text className="font-satoshi-medium text-mauve8 mb-2 text-sm">
                View All
              </Text>
            </View>
            {funds.map((fund, index) => {
              const isCurrentSelected = fund.id === selectedFund?.id

              return (
                <MotiView
                  className={clsx(
                    "flex-row border-b border-transparent py-2.5",
                    index !== funds.length - 1 && "border-b-mauve4",
                  )}
                  animate={{
                    opacity:
                      selectedFund === undefined || isCurrentSelected ? 1 : 0.7,
                  }}
                  key={fund.id}
                >
                  <View className="flex-row">
                    <View className="mr-2.5 h-6 justify-center ">
                      <MotiView
                        className="aspect-square h-2 rounded-full"
                        animate={{
                          backgroundColor:
                            selectedFund === undefined || isCurrentSelected
                              ? colors[index]
                              : saturatedColors[index],
                        }}
                      />
                    </View>
                    <View>
                      <View className="flex-row items-center">
                        <MotiText
                          className="font-satoshi-bold text-base"
                          animate={{
                            color:
                              selectedFund === undefined || isCurrentSelected
                                ? violet.violet12
                                : mauve.mauve10,
                          }}
                        >
                          {fund.name}
                        </MotiText>
                      </View>
                      <Text className="font-satoshi-medium text-mauve10 text-base">
                        {fund.txnCount}{" "}
                        {fund.txnCount === 1 ? "entry" : "entries"}
                      </Text>
                    </View>
                  </View>
                  <View className="ml-auto mt-1 items-end justify-between">
                    <Text className="font-nunito-bold text-mauve10 text-sm">
                      {toCurrency(fund.totalSpent)}
                    </Text>
                    <Text className="font-nunito-medium text-mauve10 ml-2 text-sm">
                      ({((fund.totalSpent / (total.data || 1)) * 100).toFixed()}
                      %)
                    </Text>
                  </View>
                </MotiView>
              )
            })}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const colors = pieColors8
const saturatedColors = saturatedPieColors8

function PieChart({
  data,
  total,
  selectedFund,
  setSelectedFund,
}: {
  data: FundWithTotalSpent[]
  total: number
  selectedFund: FundWithTotalSpent | undefined
  setSelectedFund: (fund: FundWithTotalSpent | undefined) => void
}) {
  const current = useSharedValue(0)
  const text = useSharedValue("")
  // const [selectedFund, setSelectedFund] = useState<FundWithTotalSpent>()

  useAnimatedReaction(
    () => current.value,
    (c) => {
      text.value = c.toFixed() + "%"
    },
  )

  useEffect(() => {
    runOnUI(() => {
      current.value = withSpring(
        ((selectedFund?.totalSpent || 0) / total) * 100,
        transitions.snappy,
      )
    })()
  }, [current, selectedFund?.totalSpent, total])

  return (
    <View className="relative items-center justify-center">
      <View className="absolute">
        {selectedFund ? (
          <AnimatedText
            text={text}
            className="font-nunito-bold text-violet12 text-2xl"
          />
        ) : null}
      </View>

      <View className="aspect-square h-40">
        <Pie
          data={data}
          onPressSlice={(fund) => {
            setSelectedFund(fund)
          }}
        />
      </View>
    </View>
  )
}

function useExpenses() {
  const total = trpc.transaction.totalThisMonth.useQuery()
  const funds = trpc.fund.list.useQuery(undefined, {
    select: (data) => {
      return data
        .filter(({ totalSpent }) => totalSpent)
        .sort((a, b) => b.totalSpent - a.totalSpent)
    },
  })

  const countByFund = trpc.transaction.countByFund.useQuery(undefined, {
    select: (data) => {
      const fundsWithTxnCount: (Exclude<
        typeof funds["data"],
        undefined
      >[number] & {
        txnCount: number
      })[] = []

      const top5Funds = funds.data?.slice(0, 5) || []
      const otherFunds = funds.data?.slice(5) || []

      for (const fund of top5Funds) {
        fundsWithTxnCount.push({
          ...fund,
          txnCount: data.find(({ fundId }) => fund.id === fundId)?._count || 0,
        })
      }

      if (otherFunds.length) {
        let totalSpent = 0
        let txnCount = 0

        for (const fund of otherFunds) {
          txnCount += data.find(({ fundId }) => fundId === fund.id)?._count || 0
          totalSpent += fund.totalSpent
        }

        const otherFund: typeof fundsWithTxnCount[number] = {
          id: -1,
          name: "Others",
          totalSpent,
          txnCount,

          // unused fields
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore type is `Decimal`
          budgetedAmount: 0,
          fundType: "SPENDING",
          enabled: true,
          folderId: -1,
          timeMode: "MONTHLY",
        }

        fundsWithTxnCount.push(otherFund)
      }

      return fundsWithTxnCount
    },
  })

  return {
    total,
    funds: countByFund.data || [],
  }
}

type FundWithTotalSpent = Fund & {
  totalSpent: number
}
