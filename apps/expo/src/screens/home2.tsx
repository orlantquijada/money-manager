import { FlashList } from "@shopify/flash-list"
import { ComponentProps, useState } from "react"
import { SafeAreaView, View, Text, Pressable } from "react-native"
import Folder from "~/components/Folder"

import Plus from "../../assets/icons/plus.svg"
import Stripes from "../../assets/icons/stripes.svg"

import HomeIcon from "../../assets/icons/home-duo-dark.svg"
import HomeFilledIcon from "../../assets/icons/home-filled-dark.svg"
import PlusRecIcon from "../../assets/icons/plus-rec-duo-dark.svg"
import PlusRecFilledIcon from "../../assets/icons/plus-rec-filled-dark.svg"
import ActivityIcon from "../../assets/icons/activity-rec-duo-dark.svg"
import ActivityFilledIcon from "../../assets/icons/activity-rec-filled-dark.svg"

export default function Home2({
  children,
  onLayout,
}: Pick<ComponentProps<typeof SafeAreaView>, "onLayout" | "children">) {
  return (
    <SafeAreaView onLayout={onLayout} className="bg-violet1">
      <View className="relative h-full w-full p-4">
        {/* header */}
        <View className="w-full flex-row items-center justify-between pt-20">
          <Text className="font-satoshi-medium text-mauve12 text-3xl">
            Dashboard
          </Text>
          <Plus className="bg-mauve12" />
        </View>

        <View className="bg-mauve12 relative mt-6 items-center justify-center overflow-hidden rounded-2xl p-6">
          <View className="border-mauve11/20 absolute inset-0 z-0 translate-x-56 overflow-hidden border-l-2">
            <Stripes />
          </View>

          <Text className="font-satoshi text-mauve8 text-sm">
            Total Spent this month
          </Text>
          <Text className="font-satoshi-bold text-mauve1 text-2xl">
            <Text className="font-satoshi text-mauve8">₱</Text>
            2,539.50
          </Text>
        </View>

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
            <Folder name={p.item.name} amountLeft={p.item.amountLeft} />
          )}
        />
        <BottomNav />
      </View>

      {children}
    </SafeAreaView>
  )
}

function BottomNav() {
  const [currentTab, setCurrentTab] = useState<"home" | "add" | "records">(
    "home",
  )

  return (
    <View className="bg-mauve12 h-[72px] flex-row items-center justify-center rounded-2xl">
      <Pressable onPress={() => setCurrentTab("home")}>
        <Home filled={currentTab === "home"} />
      </Pressable>
      <Pressable onPress={() => setCurrentTab("add")}>
        <PlusRec filled={currentTab === "add"} />
      </Pressable>
      <Pressable onPress={() => setCurrentTab("records")}>
        <Activity filled={currentTab === "records"} />
      </Pressable>
    </View>
  )
}

type IconProps = { filled?: boolean }

function Home({ filled = false }: IconProps) {
  const Icon = filled ? HomeFilledIcon : HomeIcon
  return <Icon style={{ marginRight: 40 }} />
}

function PlusRec({ filled = false }: IconProps) {
  const Icon = filled ? PlusRecFilledIcon : PlusRecIcon
  return <Icon style={{ marginRight: 40 }} />
}

function Activity({ filled = false }: IconProps) {
  const Icon = filled ? ActivityFilledIcon : ActivityIcon
  return <Icon />
}
