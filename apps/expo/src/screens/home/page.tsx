import { useCallback, useRef } from "react"
import { View } from "react-native"
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs"

import type { HomeTabsParamList } from "~/types"
import { screenPadding } from "~/utils/constants"

import SafeAreaView from "~/components/SafeAreaView"
import BottomSheetModal from "~/components/BottomSheet"
import DashboardCreateBottomSheet from "~/components/dashboard/CreateBottomSheet"
// import AlertDialog from "~/components/AlertDialog"
import HomeTabBar from "~/components/HomeTabBar"
import TotalSpent from "~/components/dashboard/TotalSpent"
import ScaleDownPressable from "~/components/ScaleDownPressable"

import BudgetsTab from "./tabs/budgets"
import TransactionsTab from "./tabs/transactions"

import Plus from "../../../assets/icons/plus.svg"

const Tab = createMaterialTopTabNavigator<HomeTabsParamList>()

export default function Home2() {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null)

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present()
  }, [])

  // const didScroll = useSharedValue(0)
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
        <View className="my-8 w-full flex-row items-start justify-between">
          <TotalSpent />
          <ScaleDownPressable
            scale={0.85}
            hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
            onPress={handlePresentModalPress}
          >
            <Plus className="bg-mauve12" />
          </ScaleDownPressable>
        </View>

        {/* <View className="mt-8 w-full flex-row items-center justify-between"> */}
        {/*   <Text className="font-satoshi-medium text-mauve12 text-3xl"> */}
        {/*     Dashboard */}
        {/*   </Text> */}
        {/*   <Pressable hitSlop={40} onPress={handlePresentModalPress}> */}
        {/*     <Plus className="bg-mauve12" /> */}
        {/*   </Pressable> */}
        {/* </View> */}

        {/* <View className="z-10 -mb-8"> */}
        {/* <View className="z-10 mb-8"> */}
        {/*   <HeaderProgressBar progress={90} didScroll={didScroll} /> */}
        {/* </View> */}

        <Tab.Navigator
          initialRouteName="Budgets"
          tabBar={(props) => <HomeTabBar {...props} />}
          sceneContainerStyle={{
            backgroundColor: "transparent",
            paddingHorizontal: screenPadding,
          }}
          style={{ marginHorizontal: -screenPadding }}
        >
          <Tab.Screen name="Budgets" component={BudgetsTab} />
          <Tab.Screen name="Transactions" component={TransactionsTab} />
        </Tab.Navigator>

        <DashboardCreateBottomSheet ref={bottomSheetModalRef} />
        {/* <AlertDialog ref={bottomSheetModalRef} /> */}
      </View>
    </SafeAreaView>
  )
}
