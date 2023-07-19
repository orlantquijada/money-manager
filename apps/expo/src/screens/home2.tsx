import { useCallback, useRef } from "react"
import { View, Text, Pressable } from "react-native"

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

  return (
    <SafeAreaView className="bg-violet1 flex-1">
      <View className="h-full px-4">
        {/* header */}
        <View className="w-full flex-row items-center justify-between pt-12">
          <Text className="font-satoshi-medium text-mauve12 text-3xl">
            Dashboard
          </Text>
          <Pressable hitSlop={40} onPress={handlePresentModalPress}>
            <Plus className="bg-mauve12" />
          </Pressable>
        </View>

        <HeaderProgressBar progress={Math.random() * 100} />

        <FoldersList />

        <DashboardCreateBottomSheet ref={bottomSheetModalRef} />
      </View>
    </SafeAreaView>
  )
}
