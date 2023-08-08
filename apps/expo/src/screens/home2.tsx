import { useCallback, useRef } from "react"
import { View, Text, Pressable, ScrollView } from "react-native"
import {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated"

import SafeAreaView from "~/components/SafeAreaView"
import BottomSheetModal from "~/components/BottomSheet"
import DashboardCreateBottomSheet from "~/components/dashboard/CreateBottomSheet"
import { HeaderProgressBar } from "~/components/dashboard/HeaderProgressBar"
import FoldersList from "~/components/dashboard/FoldersListV2"

import Plus from "../../assets/icons/plus.svg"

export default function Home2() {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null)

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present()
  }, [])

  const didScroll = useSharedValue(0)
  const offset = 200

  // TODO: scale with on scroll - just clamp height
  const handler = useAnimatedScrollHandler({
    onScroll: (event) => {
      const y = Math.ceil(event.contentOffset.y)
      if (y > offset && !didScroll.value) didScroll.value = 1
      else if (y < offset && didScroll.value) didScroll.value = 0
    },
  })

  return (
    <SafeAreaView className="bg-violet1 flex-1">
      <ScrollView
        className="h-full px-4"
        contentContainerStyle={{
          paddingBottom: 40,
        }}
      >
        <View className="mt-12 w-full flex-row items-center justify-between">
          <Text className="font-satoshi-medium text-mauve12 text-3xl">
            Dashboard
          </Text>
          <Pressable hitSlop={40} onPress={handlePresentModalPress}>
            <Plus className="bg-mauve12" />
          </Pressable>
        </View>

        <View className="z-10 -mb-8">
          <HeaderProgressBar progress={90} didScroll={didScroll} />
        </View>

        <FoldersList />

        {/* <TransactionsList /> */}

        <DashboardCreateBottomSheet ref={bottomSheetModalRef} />
      </ScrollView>
    </SafeAreaView>
  )
}
