// import { View, Text } from "react-native"
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

// import { FlashList } from "@shopify/flash-list"

import CreateTransaction from "~/screens/create-transaction";
import Home from "~/screens/home/page";
import TransactionsScreen from "~/screens/transactions";
import type { RootBottomTabParamList } from "~/types";
import { violet } from "~/utils/colors";

// import Presence from "~/components/Presence"
// import Budget from "~/components/Budget"

// import ActivityIcon from "../../assets/icons/activity-rec-duo-dark.svg";
// import ActivityFilledIcon from "../../assets/icons/activity-rec-filled-dark.svg";
// import HomeIcon from "../../assets/icons/home-duo-dark.svg";
// import HomeFilledIcon from "../../assets/icons/home-filled-dark.svg";
// import PlusRecIcon from "../../assets/icons/plus-rec-duo-dark.svg";
// import PlusRecFilledIcon from "../../assets/icons/plus-rec-filled-dark.svg";

import TabBar from "./TabBar";

const Tab = createMaterialTopTabNavigator<RootBottomTabParamList>();

const size = 24;

export default function RootTabs() {
  return (
    <Tab.Navigator
      backBehavior="history"
      initialRouteName="Home"
      sceneContainerStyle={{ backgroundColor: violet.violet1 }}
      tabBar={(props) => <TabBar {...props} />}
      tabBarPosition="bottom"
    >
      <Tab.Screen
        component={CreateTransaction}
        name="AddTransaction"
        options={
          {
            // tabBarIcon: ({ focused }) =>
            //   focused ? (
            //     <PlusRecFilledIcon
            //       color={mauveDark.mauve12}
            //       height={size}
            //       width={size}
            //     />
            //   ) : (
            //     <PlusRecIcon height={size} width={size} />
            //   ),
          }
        }
      />
      <Tab.Screen
        component={Home}
        name="Home"
        options={
          {
            // tabBarIcon: ({ focused }) =>
            //   focused ? (
            //     <HomeFilledIcon height={size} width={size} />
            //   ) : (
            //     <HomeIcon height={size} width={size} />
            //   ),
          }
        }
      />
      <Tab.Screen
        component={TransactionsScreen}
        name="Transactions"
        options={
          {
            // tabBarIcon: ({ focused }) =>
            //   focused ? (
            //     <ActivityFilledIcon height={size} width={size} />
            //   ) : (
            //     <ActivityIcon height={size} width={size} />
            //   ),
          }
        }
      />
    </Tab.Navigator>
  );
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
