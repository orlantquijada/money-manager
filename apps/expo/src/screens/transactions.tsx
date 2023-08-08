import clsx from "clsx"
import { format, isToday, isYesterday, subDays } from "date-fns"
import { View, Text, SectionList, Pressable } from "react-native"
// import PieChart from "~/components/PieChart"
import PieChart from "react-native-pie-chart"
import SafeAreaView from "~/components/SafeAreaView"
import { ToggleButton, ToggleGroup } from "~/components/ToggleGroup"
import {
  mauveDark,
  pieColors,
  pieColors2,
  pieColors3,
  pieColors4,
  pieColors5,
  pieColors6,
} from "~/utils/colors"
import {
  getRandomChoice,
  toCurrency,
  toCurrencyNarrow,
} from "~/utils/functions"

// import ChartIcon from "../../assets/icons/chart-column.svg"
import ChartIcon from "../../assets/icons/calendar-dates.svg"
import ChevronRightIcon from "../../assets/icons/hero-icons/chevron-right.svg"

export default function TransactionsScreen() {
  return (
    <SafeAreaView className="bg-violet1 flex-1">
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
              This Week
            </Text>
          </Pressable>
        </View>

        {/* <View> */}
        {/*   <Text className="font-nunito-bold text-mauve12 -mb-1 text-4xl"> */}
        {/*     {toCurrency(250.5)} */}
        {/*   </Text> */}
        {/*   <Text className="font-satoshi-medium text-mauve9 text-base"> */}
        {/*     Total spent this week */}
        {/*   </Text> */}
        {/* </View> */}
        <View className="mt-8 flex-row items-center justify-center">
          <View className="relative items-center justify-center">
            <View className="absolute">
              <Text className="font-nunito-bold text-mauve12 h-4/5 text-2xl">
                65%
              </Text>
            </View>

            <PieChart
              widthAndHeight={150}
              series={[123, 321, 123, 679, 537]}
              // sliceColor={["#fbd203", "#ffb300", "#ff9100", "#ff6c00", "#ff3c00"]}
              sliceColor={colors}
              // sliceColor={
              //   // [
              //   //   getRandomChoice(pieColors3),
              //   //   getRandomChoice(pieColors3),
              //   //   getRandomChoice(pieColors3),
              //   //   getRandomChoice(pieColors3),
              //   //   getRandomChoice(pieColors3),
              //   // ]
              //
              //   // [
              //   //   getRandomChoice(pieColors6),
              //   //   getRandomChoice(pieColors6),
              //   //   getRandomChoice(pieColors6),
              //   //   getRandomChoice(pieColors6),
              //   //   getRandomChoice(pieColors6),
              //   // ]
              //
              //   // [
              //   //   getRandomChoice(pieColors4),
              //   //   getRandomChoice(pieColors4),
              //   //   getRandomChoice(pieColors4),
              //   //   getRandomChoice(pieColors4),
              //   //   getRandomChoice(pieColors4),
              //   // ]
              //
              //   [
              //     getRandomChoice(pieColors2),
              //     getRandomChoice(pieColors2),
              //     getRandomChoice(pieColors2),
              //     getRandomChoice(pieColors2),
              //     getRandomChoice(pieColors2),
              //   ]
              //
              //   // [
              //   //   getRandomChoice(pieColors5),
              //   //   getRandomChoice(pieColors5),
              //   //   getRandomChoice(pieColors5),
              //   //   getRandomChoice(pieColors5),
              //   //   getRandomChoice(pieColors5),
              //   // ]
              //
              //   // [
              //   //   getRandomChoice(values),
              //   //   getRandomChoice(values),
              //   //   getRandomChoice(values),
              //   //   getRandomChoice(values),
              //   //   getRandomChoice(values),
              //   // ]
              // }
              coverRadius={0.75}
            />
          </View>

          <View className="ml-5 self-start">
            {colors.map((color, index) => (
              <View
                key={color + index}
                className={clsx(
                  "mb-1 flex-row items-center border-b-transparent",
                  index !== colors.length - 1 && "border-b-mauve6",
                )}
              >
                <View
                  className="mr-2 aspect-square h-2 rounded-full"
                  style={{ backgroundColor: color }}
                />

                <Text className="font-satoshi-bold text-mauve12">
                  Groceries
                </Text>
              </View>
            ))}
          </View>

          {/* <ToggleGroup className="my-4 w-1/2"> */}

          {/*   <ToggleButton selected>Week</ToggleButton> */}
          {/*   <ToggleButton>Month</ToggleButton> */}
          {/* </ToggleGroup> */}
          {/* <TransactionsList /> */}
        </View>

        <View className="mt-6">
          <View className="flex-row items-center justify-between">
            <Text className="font-satoshi-bold text-mauve9 mb-2 text-xl">
              Top Funds
            </Text>

            <Text className="font-satoshi-medium text-mauve9 mb-2 text-sm">
              View All
            </Text>
          </View>
          {colors.slice(0, 3).map((color, index) => (
            <View
              className={clsx(
                "flex-row items-center border-b border-transparent py-2.5",
                index !== 2 && "border-b-mauve4",
              )}
              key={color + index}
            >
              <View
                className="mr-2 aspect-square h-2 rounded-full"
                style={{ backgroundColor: color }}
              />
              <Text className="font-satoshi-bold text-mauve12 text-base">
                Groceries
              </Text>
              <Text className="font-nunito-bold text-mauve9 ml-auto text-sm">
                {toCurrency(250.25)}
              </Text>
            </View>
          ))}
        </View>

        {/* <TransactionsList /> */}
      </View>
    </SafeAreaView>
  )
}
const colors = [
  getRandomChoice(pieColors2),
  getRandomChoice(pieColors2),
  getRandomChoice(pieColors2),
  getRandomChoice(pieColors2),
  getRandomChoice(pieColors2),
]

const values = Object.values(pieColors)

// TODO: add this to home dashboard
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
