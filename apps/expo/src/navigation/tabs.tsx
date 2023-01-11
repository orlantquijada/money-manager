import { View, Pressable } from "react-native"
import {
  createBottomTabNavigator,
  BottomTabBarProps,
  BottomTabNavigationOptions,
} from "@react-navigation/bottom-tabs"
import { Text } from "react-native"

import Home2 from "~/screens/home2"

import { RootBottomTabParamList } from "~/types"

import HomeIcon from "../../assets/icons/home-duo-dark.svg"
import HomeFilledIcon from "../../assets/icons/home-filled-dark.svg"

import PlusRecIcon from "../../assets/icons/plus-rec-duo-dark.svg"
import PlusRecFilledIcon from "../../assets/icons/plus-rec-filled-dark.svg"

import ActivityIcon from "../../assets/icons/activity-rec-duo-dark.svg"
import ActivityFilledIcon from "../../assets/icons/activity-rec-filled-dark.svg"
import { FlashList } from "@shopify/flash-list"
import Presence from "~/components/Presence"
import Folder from "~/components/Folder"

const Tab = createBottomTabNavigator<RootBottomTabParamList>()

export default function RootTabs() {
  return (
    <Tab.Navigator
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen
        name="Home"
        component={Home2}
        options={{
          tabBarIcon: ({ focused }) =>
            focused ? <HomeFilledIcon /> : <HomeIcon />,
        }}
      />
      <Tab.Screen
        name="AddTransaction"
        component={PlaceHolderScreen}
        options={{
          tabBarIcon: ({ focused }) =>
            focused ? <PlusRecFilledIcon /> : <PlusRecIcon />,
        }}
      />
      <Tab.Screen
        name="Transactions"
        component={PlaceHolderScreen}
        options={{
          tabBarIcon: ({ focused }) =>
            focused ? <ActivityFilledIcon /> : <ActivityIcon />,
        }}
      />
    </Tab.Navigator>
  )
}

function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  return (
    <View
      className="bg-mauve12 absolute bottom-3 left-0 right-0 mx-4 mb-4 h-[72px] flex-row items-center justify-center rounded-2xl"
      style={{ zIndex: 10 }}
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key] as {
          options: BottomTabNavigationOptions
        }
        const Icon = options.tabBarIcon

        const isFocused = state.index === index

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          })

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name)
          }
        }

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          })
        }

        return (
          <Pressable
            onPress={onPress}
            onLongPress={onLongPress}
            style={index === 0 ? {} : { marginLeft: 40 }}
            key={route.key}
            hitSlop={15}
          >
            {/* @ts-expect-error annoyting to handle (just check https://reactnavigation.org/docs/bottom-tab-navigator/) */}
            {Icon ? <Icon focused={isFocused} /> : null}
          </Pressable>
        )
      })}
    </View>
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
