import { useBottomSheet } from "@gorhom/bottom-sheet"
import { Text, View } from "react-native"
import * as DropdownMenu from "zeego/dropdown-menu"

import { FundWithMeta } from "~/types"
import { toCurrencyNarrow } from "~/utils/functions"
import { useRootBottomTabNavigation } from "~/utils/hooks/useRootBottomTabNavigation"
import { mauve, violet } from "~/utils/colors"

import ScaleDownPressable from "../ScaleDownPressable"
import Button from "../Button"
import CategoryProgressBars from "../CategoryProgressBars"

// import Ellipsis from "../../../assets/icons/hero-icons/ellipsis-horizontal.svg"
import Ellipsis from "../../../assets/icons/more-horiz.svg"
import ChevronRight from "../../../assets/icons/hero-icons/chevron-right.svg"

type Props = {
  fund: FundWithMeta
}

export default function FundDetailContent({ fund }: Props) {
  const navigation = useRootBottomTabNavigation()
  const { close } = useBottomSheet()

  return (
    <View className="flex-1 px-4 pb-4">
      <View className="h-10 flex-row items-center justify-between">
        <View className="flex-row items-center">
          <View className="bg-violet4 mr-2 aspect-square w-12 items-center justify-center rounded-full">
            <Ellipsis
              width={24}
              height={24}
              strokeWidth={3}
              color={violet.violet8}
            />
          </View>

          <View>
            <Text className="text-mauve12 font-satoshi-bold text-lg">
              {fund.name}
            </Text>
            <Text className="text-mauve9 font-satoshi text-sm">Spending</Text>
          </View>
        </View>
        <Dropdown />
      </View>

      <View className="mt-10">
        <Text className="font-satoshi text-mauve9 text-sm">
          <Text className="font-nunito-semibold">
            {toCurrencyNarrow(fund.totalBudgetedAmount - fund.totalSpent)}
          </Text>{" "}
          Available for spending
        </Text>

        <CategoryProgressBars fund={fund} />
      </View>

      {/* details / rows */}
      <View className="mt-8 space-y-2">
        <View className="flex-row items-center justify-between">
          <Text className="font-satoshi-medium text-mauve9 mr-auto text-base">
            Total Budgeted Amount
          </Text>
          <Text className="font-nunito-semibold text-mauve11 text-base">
            {toCurrencyNarrow(fund.totalBudgetedAmount)}
          </Text>

          <ScaleDownPressable
            scale={0.9}
            className="ml-3 aspect-square w-6 items-center justify-center rounded-md"
          ></ScaleDownPressable>
        </View>
        <View className="flex-row items-center justify-between">
          <Text className="font-satoshi-medium text-mauve9 mr-auto text-base">
            Total Spent this month
          </Text>
          <Text className="font-nunito-semibold text-mauve11 text-base">
            {toCurrencyNarrow(fund.totalSpent)}
          </Text>

          <ScaleDownPressable
            scale={0.9}
            className="bg-mauve3 ml-3 aspect-square w-6 items-center justify-center rounded-md"
          >
            <ChevronRight
              width={15}
              height={15}
              strokeWidth={3}
              color={mauve.mauve8}
            />
          </ScaleDownPressable>
        </View>
        <View className="flex-row items-center justify-between">
          <Text className="font-satoshi-medium text-mauve9 mr-auto text-base">
            Total Spent last month
          </Text>
          <Text className="font-nunito-semibold text-mauve11 text-base">
            {toCurrencyNarrow(400)}
          </Text>

          <ScaleDownPressable
            scale={0.9}
            className="bg-mauve3 ml-3 aspect-square w-6 items-center justify-center rounded-md"
          >
            <ChevronRight
              width={15}
              height={15}
              strokeWidth={3}
              color={mauve.mauve8}
            />
          </ScaleDownPressable>
        </View>
      </View>

      <ScaleDownPressable
        containerStyle={{ marginTop: "auto" }}
        onPress={() => {
          close()
          navigation.navigate("AddTransaction", { fundId: fund.id })
        }}
      >
        <Button className="h-10">
          <Text className="font-satoshi-medium text-mauve12">Add Expense</Text>
        </Button>
      </ScaleDownPressable>
    </View>
  )
}

function Dropdown() {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <ScaleDownPressable
          scale={0.9}
          className="bg-mauve3 aspect-square w-6 items-center justify-center rounded-md"
        >
          <Ellipsis
            strokeWidth={3}
            color={mauve.mauve8}
            height={15}
            width={15}
          />
        </ScaleDownPressable>
      </DropdownMenu.Trigger>

      <DropdownMenu.Content>
        <DropdownMenu.Label>Label</DropdownMenu.Label>
        <DropdownMenu.Item
          key="item 1"
          destructive
          onSelect={() => {
            console.log("wow")
          }}
        >
          <DropdownMenu.ItemTitle>Hello World</DropdownMenu.ItemTitle>

          <DropdownMenu.ItemIcon
            ios={{
              name: "trash", // required
              scale: "small",
            }}
          />
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}
