import clsx from "clsx";
import { format, isToday, isYesterday, subDays } from "date-fns";
import { Pressable, SectionList, Text, View } from "react-native";
// import PieChart from "~/components/PieChart"
import PieChart from "react-native-pie-chart";
import SafeAreaView from "~/components/SafeAreaView";
import { pieColors, pieColors2 } from "~/utils/colors";
import {
  getRandomChoice,
  toCurrency,
  toCurrencyNarrow,
} from "~/utils/functions";

// import ChartIcon from "../../assets/icons/chart-column.svg"
// import ChartIcon from "../../assets/icons/calendar-dates.svg";

export default function TransactionsScreen() {
  return (
    <SafeAreaView className="flex-1 bg-violet1">
      <View className="h-full px-4">
        <View className="mt-8 h-10 w-full flex-row items-center justify-between">
          <Text className="font-satoshi-bold text-mauve12 text-xl">
            {/* Transactions */}
            Expense Structure
          </Text>
          <Pressable className="flex-row items-center justify-center">
            {/* <ChartIcon */}
            {/*   // color={mauveDark.mauve12} */}
            {/*   height={20} */}
            {/*   strokeWidth={3} */}
            {/*   width={20} */}
            {/* /> */}
            <Text className="ml-2 font-satoshi-medium text-mauve12 text-sm">
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
              <Text className="h-4/5 font-nunito-bold text-2xl text-mauve12">
                65%
              </Text>
            </View>

            <PieChart
              coverRadius={0.75}
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
              widthAndHeight={150}
            />
          </View>

          <View className="ml-5 self-start">
            {colors.map((color, index) => (
              <View
                className={clsx(
                  "mb-1 flex-row items-center border-b-transparent",
                  index !== colors.length - 1 && "border-b-mauve6"
                )}
                key={color + index}
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
            <Text className="mb-2 font-satoshi-bold text-mauve9 text-xl">
              Top Funds
            </Text>

            <Text className="mb-2 font-satoshi-medium text-mauve9 text-sm">
              View All
            </Text>
          </View>
          {colors.slice(0, 3).map((color, index) => (
            <View
              className={clsx(
                "flex-row border-transparent border-b py-2.5",
                index !== 2 && "border-b-mauve4"
              )}
              key={color + index}
            >
              <View className="flex-row">
                <View className="mr-2.5 h-6 justify-center">
                  <View
                    className="aspect-square h-2 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                </View>
                <View>
                  <Text className="font-satoshi-bold text-base text-mauve12">
                    Groceries
                  </Text>
                  {/* TODO: number of entries */}
                  <Text className="font-satoshi-medium text-base text-mauve10">
                    4 entries
                  </Text>
                </View>
              </View>
              <Text className="ml-auto font-nunito-bold text-mauve9 text-sm">
                {toCurrency(250.25)}
              </Text>
            </View>
          ))}
        </View>

        {/* <TransactionsList /> */}
      </View>
    </SafeAreaView>
  );
}
const colors = [
  getRandomChoice(pieColors2),
  getRandomChoice(pieColors2),
  getRandomChoice(pieColors2),
  getRandomChoice(pieColors2),
  getRandomChoice(pieColors2),
];

const _values = Object.values(pieColors);

// TODO: add this to home dashboard
function _TransactionsList() {
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
        contentContainerStyle={{
          paddingBottom: 48,
        }}
        ItemSeparatorComponent={() => <View className="h-2" />}
        renderItem={({ item, section, index }) => (
          <View
            className="flex-row items-center bg-violet1"
            style={{
              marginBottom: section.data.length - 1 === index ? 24 : 0,
            }}
          >
            {/* <View className="bg-mauve4 mr-2 aspect-square h-full rounded-full" /> */}

            <View className="flex-grow flex-row items-center justify-between">
              <View>
                <Text className="font-satoshi-bold text-base text-mauve12 capitalize">
                  {item.fundName}
                </Text>
                {item.store ? (
                  <Text className="font-satoshi text-base text-mauve11">
                    {item.store}
                  </Text>
                ) : null}
              </View>

              <Text className="font-nunito-semibold text-base text-mauve11">
                {toCurrencyNarrow(item.amount)}
              </Text>
            </View>
          </View>
        )}
        renderSectionHeader={({ section }) => {
          const getTitle = (date: Date) => {
            if (isToday(date)) {
              return "Today";
            }
            if (isYesterday(date)) {
              return "Yesterday";
            }

            return format(date, "MMM d");
          };
          return (
            <Text className="bg-violet1 pb-3 font-satoshi-bold text-lg text-mauve8">
              {getTitle(section.title)}
            </Text>
          );
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
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
