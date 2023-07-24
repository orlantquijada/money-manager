import { useCallback, useRef } from "react"
import { View, Text, Pressable } from "react-native"
import {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated"

import SafeAreaView from "~/components/SafeAreaView"
import BottomSheetModal from "~/components/BottomSheet"
import DashboardCreateBottomSheet from "~/components/dashboard/CreateBottomSheet"
import { HeaderProgressBar } from "~/components/dashboard/HeaderProgressBar"
import FoldersList from "~/components/dashboard/FoldersList"

import Plus from "../../assets/icons/plus.svg"

export default function Home2() {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null)

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present()
  }, [])

  const didScroll = useSharedValue(0)
  const offset = 200

  const handler = useAnimatedScrollHandler({
    onScroll: (event) => {
      const y = Math.ceil(event.contentOffset.y)
      if (y > offset && !didScroll.value) didScroll.value = 1
      else if (y < offset && didScroll.value) didScroll.value = 0
    },
  })

  return (
    <SafeAreaView className="bg-violet1 flex-1">
      <View className="h-full px-4">
        {/* header */}
        <View className="mt-12 w-full flex-row items-center justify-between">
          <Text className="font-satoshi-medium text-mauve12 text-3xl">
            Dashboard
          </Text>
          <Pressable hitSlop={40} onPress={handlePresentModalPress}>
            <Plus className="bg-mauve12" />
          </Pressable>
        </View>

        {/* <HeaderProgressBar progress={Math.random() * 100} /> */}
        <View className="z-10 -mb-8">
          <HeaderProgressBar progress={90} didScroll={didScroll} />
        </View>

        <FoldersList onScroll={handler} />

        <DashboardCreateBottomSheet ref={bottomSheetModalRef} />
      </View>
    </SafeAreaView>
  )
}
