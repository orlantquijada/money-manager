import { SectionList, Text, View } from "react-native"
import { format, isToday, isYesterday, subDays } from "date-fns"

import { toCurrencyNarrow } from "~/utils/functions"

export function TransactionsList() {
  return (
    <View className="relative flex-1">
      <SectionList
        ListHeaderComponent={
          <Text className="font-satoshi-medium text-mauve12 my-10 mb-4 text-xl">
            History
          </Text>
        }
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
                  {item.fundName}
                </Text>
                {item.store ? (
                  <Text className="text-mauve11 font-satoshi text-base">
                    {item.store}
                  </Text>
                ) : null}
              </View>

              <Text className="text-mauve11 font-nunito-semibold text-base">
                {toCurrencyNarrow(item.amount)}
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
        sections={[
          {
            data: [
              { fundName: "Grocery", store: "PureGold", amount: 1325 },
              { fundName: "Internet", store: "Converge", amount: 1625.5 },
              { fundName: "Laundry", store: "", amount: 255 },
            ],
            title: new Date(),
          },
          {
            data: [
              {
                fundName: "Books",
                store: "Tress of the Emerald Sea",
                amount: 1499,
              },
              { fundName: "Spotfy", amount: 499 },
              { fundName: "Eating Out", store: "Jollibee", amount: 378 },
            ],
            title: subDays(new Date(), 1),
          },
          {
            data: [
              {
                fundName: "Books",
                store: "Tress of the Emerald Sea",
                amount: 1499,
              },
              { fundName: "Spotfy", amount: 499 },
              { fundName: "Eating Out", store: "Jollibee", amount: 378 },
            ],
            title: subDays(new Date(), 2),
          },
          {
            data: [
              {
                fundName: "Books",
                store: "Tress of the Emerald Sea",
                amount: 1499,
              },
              { fundName: "Spotfy", amount: 499 },
              { fundName: "Eating Out", store: "Jollibee", amount: 378 },
            ],
            title: subDays(new Date(), 5),
          },
          {
            data: [
              {
                fundName: "Books",
                store: "Tress of the Emerald Sea",
                amount: 1499,
              },
              { fundName: "Spotfy", amount: 499 },
              { fundName: "Eating Out", store: "Jollibee", amount: 378 },
            ],
            title: subDays(new Date(), 5),
          },
        ]}
        // contentContainerStyle={{ paddingBottom: 48, position: "relative" }}
        contentContainerStyle={{
          paddingBottom: 48,
        }}
      />
    </View>
  )
}
