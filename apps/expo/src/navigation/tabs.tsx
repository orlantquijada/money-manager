// import { View, Text } from "react-native"
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs"
// import { FlashList } from "@shopify/flash-list"

import { RootBottomTabParamList } from "~/types"
import { mauveDark, violet } from "~/utils/colors"

import Home from "~/screens/home/page"
import CreateTransaction from "~/screens/create-transaction"
import TransactionsScreen from "~/screens/transactions"

// import Presence from "~/components/Presence"
// import Budget from "~/components/Budget"

import HomeIcon from "../../assets/icons/home-duo-dark.svg"
import HomeFilledIcon from "../../assets/icons/home-filled-dark.svg"
import PlusRecIcon from "../../assets/icons/plus-rec-duo-dark.svg"
import PlusRecFilledIcon from "../../assets/icons/plus-rec-filled-dark.svg"
import ActivityIcon from "../../assets/icons/activity-rec-duo-dark.svg"
import ActivityFilledIcon from "../../assets/icons/activity-rec-filled-dark.svg"

import TabBar from "./TabBar"

const Tab = createMaterialTopTabNavigator<RootBottomTabParamList>()

const size = 24

export default function RootTabs() {
  return (
    <Tab.Navigator
      tabBar={(props) => <TabBar {...props} />}
      tabBarPosition="bottom"
      sceneContainerStyle={{ backgroundColor: violet.violet1 }}
      initialRouteName="Home"
      backBehavior="history"
    >
      <Tab.Screen
        name="AddTransaction"
        component={CreateTransaction}
        options={{
          tabBarIcon: ({ focused }) =>
            focused ? (
              <PlusRecFilledIcon
                width={size}
                height={size}
                color={mauveDark.mauve12}
              />
            ) : (
              <PlusRecIcon width={size} height={size} />
            ),
        }}
      />
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({ focused }) =>
            focused ? (
              <HomeFilledIcon width={size} height={size} />
            ) : (
              <HomeIcon width={size} height={size} />
            ),
        }}
      />
      <Tab.Screen
        name="Transactions"
        component={TransactionsScreen}
        options={{
          tabBarIcon: ({ focused }) =>
            focused ? (
              <ActivityFilledIcon width={size} height={size} />
            ) : (
              <ActivityIcon width={size} height={size} />
            ),
        }}
      />
    </Tab.Navigator>
  )
}

// function PlaceHolderScreen() {
//   return (
//     <View className="bg-violet8 h-full w-full">
//       <FlashList
//         data={[
//           { name: "Folder 1", amountLeft: 241.5 },
//           { name: "Bills", amountLeft: 3500 },
//           { name: "Quality of Life", amountLeft: 83 },
//         ]}
//         showsVerticalScrollIndicator={false}
//         estimatedItemSize={5}
//         ListHeaderComponent={
//           <Text className="font-satoshi-medium text-mauve12 mt-8 mb-4 text-xl">
//             Budgets
//           </Text>
//         }
//         ItemSeparatorComponent={() => <View className="h-2" />}
//         contentContainerStyle={{ paddingBottom: 40 }}
//         renderItem={(p) => (
//           <Presence delayMultiplier={p.index + 1}>
//             <Budget
//               folderId={1}
//               folderName={p.item.name}
//               amountLeft={p.item.amountLeft}
//               funds={[]}
//             />
//           </Presence>
//         )}
//       />
//     </View>
//   )
// }
