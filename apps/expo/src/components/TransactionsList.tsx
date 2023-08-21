import { SectionList, Text, View } from "react-native"

import {
  formatDefaultReadableDate,
  formatRelativeDate,
  toCurrencyNarrow,
} from "~/utils/functions"
import { trpc } from "~/utils/trpc"
import useToggle from "~/utils/hooks/useToggle"

import ScaleDownPressable from "./ScaleDownPressable"

export function TransactionsList() {
  const transactions = useTransactionsList()

  return (
    <View className="relative flex-1">
      <SectionList
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        renderItem={({ item, section, index }) => (
          <View
            className="bg-violet1 flex-row items-center"
            style={{
              marginBottom: section.data.length - 1 === index ? 24 : 0,
            }}
          >
            {/* <View className="bg-mauve4 mr-2 aspect-square h-full rounded-full" /> */}

            <View className="flex-grow flex-row items-center justify-between">
              <View>
                <Text className="text-mauve12 font-satoshi-bold text-base capitalize">
                  {item.fund.name}
                </Text>
                {item.store ? (
                  <Text className="text-mauve11 font-satoshi text-base">
                    {item.store.name}
                  </Text>
                ) : null}
              </View>

              <Text className="text-mauve11 font-nunito-semibold text-base">
                {toCurrencyNarrow(Number(item.amount))}
              </Text>
            </View>
          </View>
        )}
        ItemSeparatorComponent={() => <View className="h-2" />}
        renderSectionHeader={({ section }) => (
          <SectionHeader section={section} />
        )}
        sections={transactions.data || []}
        contentContainerStyle={{
          paddingBottom: 48,
        }}
      />
    </View>
  )
}

function SectionHeader({
  section,
}: {
  section: NonNullable<ReturnType<typeof useTransactionsList>["data"]>[number]
}) {
  const [showDefaultText, { toggle }] = useToggle(true)

  return (
    <ScaleDownPressable
      onPress={toggle}
      scale={0.94}
      containerStyle={{
        alignSelf: "flex-start",
      }}
    >
      <Text className="text-mauve8 font-satoshi-bold pb-3 text-lg">
        {showDefaultText
          ? formatRelativeDate(section.title, new Date())
          : formatDefaultReadableDate(section.title)}
      </Text>
    </ScaleDownPressable>
  )
}

const formatKey = (date: Date) => {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
}
const parseKey = (dateString: string) => {
  const [year, month, date] = dateString.split("-").map(Number)
  // @ts-expect-error type should be Number bec of the cast
  return new Date(year, month, date)
}

function useTransactionsList() {
  return trpc.transaction.allThisMonth.useQuery(undefined, {
    select: (transactions) => {
      // date string as key
      const groupByDate: Record<string, typeof transactions[number][]> = {}

      for (const transaction of transactions) {
        const date = transaction.date
        const key = formatKey(transaction.date || new Date())
        if (!date) continue
        else if (groupByDate[key]) {
          groupByDate[key]?.push(transaction)
        } else {
          groupByDate[key] = [transaction]
        }
      }

      return Object.entries(groupByDate).map(([key, value]) => ({
        title: parseKey(key),
        data: value,
      }))
    },
  })
}
