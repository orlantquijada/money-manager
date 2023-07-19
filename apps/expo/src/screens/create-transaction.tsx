import { useState } from "react"
import { Pressable, Text, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { mauveDark } from "~/utils/colors"
import { useRootBottomTabNavigation } from "~/utils/hooks/useRootBottomTabNavigation"

import SafeAreaView from "~/components/SafeAreaView"
import ScaleDownPressable from "~/components/ScaleDownPressable"
import Button from "~/components/Button"
import { Amount } from "~/components/create-transaction/Amount"
import { Numpad } from "~/components/create-transaction/Numpad"

import CrossIcon from "../../assets/icons/hero-icons/x-mark.svg"

export default function CreateTransaction() {
  // show default insets since tabbar isn't shown on this screen
  const insets = useSafeAreaInsets()
  const navigation = useRootBottomTabNavigation()

  const [number, setNumber] = useState("0")

  return (
    <SafeAreaView
      className="bg-mauveDark1 flex-1 justify-between p-4 pb-8"
      insets={insets}
    >
      <View className="mt-8 h-10 w-full flex-row items-center justify-between">
        <Text className="font-satoshi-bold text-mauveDark12 text-xl">
          Add Expense
        </Text>

        <Pressable
          className="aspect-square w-8 items-center justify-center"
          onPress={() => navigation.goBack()}
        >
          <CrossIcon
            color={mauveDark.mauve12}
            height={24}
            width={24}
            strokeWidth={3}
          />
        </Pressable>
      </View>

      <View className="flex-grow items-center justify-center">
        <Amount amount={Number(number)} />
      </View>

      <View>
        <View className="mb-4">
          <View className="border-b-mauveDark5 h-10 w-full flex-row items-center border-b">
            <Text className="text-mauveDark12 font-satoshi-bold text-base leading-6">
              Today at 10:08 AM
            </Text>
            <Text className="text-mauveDark11 font-satoshi-bold mx-4 text-base leading-6">
              ·
            </Text>
            <Text className="text-mauveDark11 font-satoshi-bold text-base leading-6">
              Add Note
            </Text>
          </View>
          <View className="border-b-mauveDark5 h-10 w-full flex-row items-center border-b">
            <Text className="text-mauveDark11 font-satoshi-bold text-base leading-6">
              Store
            </Text>
            <Text className="text-mauveDark11 font-satoshi-bold mx-4 text-base leading-6">
              ·
            </Text>
            <Text className="text-mauveDark11 font-satoshi-bold text-base leading-6">
              Fund
            </Text>
          </View>
        </View>

        <Numpad setNumber={setNumber} className="mb-8" />

        <ScaleDownPressable>
          <Button className="h-12 w-full rounded-2xl">
            <Text className="text-mauveDark1 font-satoshi-bold text-lg leading-6">
              Save
            </Text>
          </Button>
        </ScaleDownPressable>
      </View>
    </SafeAreaView>
  )
}
