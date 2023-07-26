import { View, Text, SectionList } from "react-native"
import SafeAreaView from "~/components/SafeAreaView"
import { toCurrencyNarrow } from "~/utils/functions"

export default function TransactionsScreen() {
  return (
    <SafeAreaView className="bg-violet1 flex-1">
      <View className="h-full px-4">
        <View className="mt-8 h-10 w-full flex-row items-center justify-between">
          <Text className="font-satoshi-bold text-mauve12 text-2xl">
            Transactions
          </Text>
        </View>

        <TransactionsList />
      </View>
    </SafeAreaView>
  )
}

function TransactionsList() {
  return (
    <View className="relative flex-1">
      {/* <FlatList */}
      {/*   data={transactions.data} */}
      {/*   keyExtractor={({ id, date }) => */}
      {/*     id.toString() + date?.toLocaleTimeString() */}
      {/*   } */}
      {/*   renderItem={({ item }) => ( */}
      {/*     <View> */}
      {/*       <Text className="font-nunito-semibold text-mauve12 text-base"> */}
      {/*         {toCurrency(Number(item.amount))} */}
      {/*       </Text> */}
      {/*     </View> */}
      {/*   )} */}
      {/* /> */}
      <SectionList
        showsVerticalScrollIndicator={false}
        renderItem={({ item, section, index }) => (
          <View
            className="bg-violet1 h-[42] flex-row items-center"
            style={{
              marginBottom: section.data.length - 1 === index ? 24 : 0,
            }}
          >
            <View className="bg-mauve4 mr-2 aspect-square h-full rounded-full" />

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
        ItemSeparatorComponent={() => <View className="h-3" />}
        renderSectionHeader={({ section }) => (
          <Text className="text-mauve8 font-satoshi-bold bg-violet1 pb-3 text-lg">
            {section.title}
          </Text>
        )}
        sections={[
          {
            data: [
              { fundName: "Grocery", store: "PureGold", amount: 1325 },
              { fundName: "Internet", store: "Converge", amount: 1625.5 },
              { fundName: "Laundry", store: "", amount: 255 },
            ],
            title: "Today",
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
            title: "Yesterday",
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
            title: "Yesterday",
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
            title: "Yesterday",
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
            title: "Yesterday",
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
