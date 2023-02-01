import { View, Text } from "react-native"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { FlashList } from "@shopify/flash-list"

import { RootBottomTabParamList } from "~/types"
import Home2 from "~/screens/home2"
import Presence from "~/components/Presence"
import Folder from "~/components/Folder"

import HomeIcon from "../../assets/icons/home-duo-dark.svg"
import HomeFilledIcon from "../../assets/icons/home-filled-dark.svg"
import PlusRecIcon from "../../assets/icons/plus-rec-duo-dark.svg"
import PlusRecFilledIcon from "../../assets/icons/plus-rec-filled-dark.svg"
import ActivityIcon from "../../assets/icons/activity-rec-duo-dark.svg"
import ActivityFilledIcon from "../../assets/icons/activity-rec-filled-dark.svg"

import TabBar from "./TabBar"
import { violet } from "~/utils/colors"

const Tab = createBottomTabNavigator<RootBottomTabParamList>()

export default function RootTabs() {
  return (
    <Tab.Navigator
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{ headerShown: false, tabBarHideOnKeyboard: true }}
      sceneContainerStyle={{ backgroundColor: violet.violet12 }}
    >
      <Tab.Screen
        name="Home"
        component={Home2}
        options={{
          tabBarIcon: ({ focused, size }) =>
            focused ? (
              <HomeFilledIcon width={size} height={size} />
            ) : (
              <HomeIcon width={size} height={size} />
            ),
        }}
      />
      <Tab.Screen
        name="AddTransaction"
        component={PlaceHolderScreen}
        options={{
          tabBarIcon: ({ focused, size }) =>
            focused ? (
              <PlusRecFilledIcon width={size} height={size} />
            ) : (
              <PlusRecIcon width={size} height={size} />
            ),
        }}
      />
      <Tab.Screen
        name="Transactions"
        component={PlaceHolderScreen}
        options={{
          tabBarIcon: ({ focused, size }) =>
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

function PlaceHolderScreen() {
  return (
    <View className="bg-violet8 h-full w-full">
      <FlashList
        data={[
          { name: "Folder 1", amountLeft: 241.5 },
          { name: "Bills", amountLeft: 3500 },
          { name: "Quality of Life", amountLeft: 83 },
        ]}
        showsVerticalScrollIndicator={false}
        estimatedItemSize={5}
        ListHeaderComponent={
          <Text className="font-satoshi-medium text-mauve12 mt-8 mb-4 text-xl">
            Budgets
          </Text>
        }
        ItemSeparatorComponent={() => <View className="h-2" />}
        contentContainerStyle={{ paddingBottom: 40 }}
        renderItem={(p) => (
          <Presence delayMultiplier={p.index + 1}>
            <Folder name={p.item.name} amountLeft={p.item.amountLeft} />
          </Presence>
        )}
      />
    </View>
  )
}
