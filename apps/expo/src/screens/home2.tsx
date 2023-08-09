import { useCallback, useRef } from "react"
import { View, Text, Pressable } from "react-native"
import { useSharedValue } from "react-native-reanimated"

import SafeAreaView from "~/components/SafeAreaView"
import BottomSheetModal from "~/components/BottomSheet"
import DashboardCreateBottomSheet from "~/components/dashboard/CreateBottomSheet"
import { HeaderProgressBar } from "~/components/dashboard/HeaderProgressBar"
import FoldersList from "~/components/dashboard/FoldersList"

import Plus from "../../assets/icons/plus.svg"
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs"
import { HomeTabsParamList } from "~/types"
import HomeTabBar from "~/components/HomeTabBar"
import { TransactionsList } from "~/components/TransactionsList"

const Tab = createMaterialTopTabNavigator<HomeTabsParamList>()

export default function Home2() {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null)

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present()
  }, [])

  const didScroll = useSharedValue(0)
  // const offset = 200
  // // TODO: scale with on scroll - just clamp height
  // const handler = useAnimatedScrollHandler({
  //   onScroll: (event) => {
  //     const y = Math.ceil(event.contentOffset.y)
  //     if (y > offset && !didScroll.value) didScroll.value = 1
  //     else if (y < offset && didScroll.value) didScroll.value = 0
  //   },
  // })

  return (
    <SafeAreaView className="bg-violet1 flex-1">
      <View className="h-full px-4">
        <View className="mt-8 w-full flex-row items-center justify-between">
          <Text className="font-satoshi-medium text-mauve12 text-3xl">
            Dashboard
          </Text>
          <Pressable hitSlop={40} onPress={handlePresentModalPress}>
            <Plus className="bg-mauve12" />
          </Pressable>
        </View>

        {/* <View className="z-10 -mb-8"> */}
        <View className="z-10 mb-8">
          <HeaderProgressBar progress={90} didScroll={didScroll} />
        </View>

        <Tab.Navigator
          initialRouteName="Budgets"
          tabBar={(props) => <HomeTabBar {...props} />}
          sceneContainerStyle={{
            backgroundColor: "transparent",
            paddingTop: 20,
          }}
        >
          <Tab.Screen name="Budgets" component={FoldersList} />
          <Tab.Screen name="Transactions" component={TransactionsList} />
        </Tab.Navigator>

        <DashboardCreateBottomSheet ref={bottomSheetModalRef} />
      </View>
    </SafeAreaView>
  )
}
