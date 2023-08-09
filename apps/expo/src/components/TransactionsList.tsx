import { SectionList, Text, View } from "react-native"
import { format, isToday, isYesterday } from "date-fns"

import { toCurrencyNarrow } from "~/utils/functions"
import { trpc } from "~/utils/trpc"

export function TransactionsList() {
  const transactions = useTransactionsList()

  return (
    <View className="relative flex-1">
      <SectionList
        showsVerticalScrollIndicator={false}
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
        renderSectionHeader={({ section }) => {
          const getTitle = (date: Date) => {
            if (isToday(date)) {
              return "Today"
            } else if (isYesterday(date)) {
              return "Yesterday"
            }

            return format(date, "MMM d")
          }
          return (
            <Text className="text-mauve8 font-satoshi-bold bg-violet1 pb-3 text-lg">
              {getTitle(section.title)}
            </Text>
          )
        }}
        sections={transactions.data || []}
        contentContainerStyle={{
          paddingBottom: 48,
        }}
      />
    </View>
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
  return trpc.transaction.allThisWeek.useQuery(undefined, {
    select: (data) => {
      // date string as key
      const _data: Record<string, typeof data[number][]> = {}

      for (const transaction of data) {
        const day = transaction.date
        const key = formatKey(transaction.date || new Date())
        if (!day) continue
        else if (_data[key]) {
          _data[key]?.push(transaction)
        } else {
          _data[key] = [transaction]
        }
      }

      return Object.entries(_data).map(([key, value]) => ({
        title: parseKey(key),
        data: value,
      }))
    },
  })
}
