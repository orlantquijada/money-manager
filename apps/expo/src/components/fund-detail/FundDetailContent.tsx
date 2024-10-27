import { useBottomSheet } from "@gorhom/bottom-sheet"
import { Dimensions, Text, View } from "react-native"
import * as DropdownMenu from "zeego/dropdown-menu"
import Animated, {
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated"
import clsx from "clsx"

import { FundWithMeta } from "~/types"
import { toCurrencyNarrow } from "~/utils/functions"
import { useRootBottomTabNavigation } from "~/utils/hooks/useRootBottomTabNavigation"
import { mauve, violet, lime } from "~/utils/colors"
import { fundTypeReadableText } from "~/utils/constants"

import ScaleDownPressable from "../ScaleDownPressable"
import CategoryProgressBars from "../dashboard/Fund/CategoryProgressBars"
import ActionButton from "./ActionButton"
import HelperText from "./HelperText"
import RecentTransactions from "./RecentTransactions"

// import Ellipsis from "../../../assets/icons/hero-icons/ellipsis-horizontal.svg"
import Ellipsis from "../../../assets/icons/more-horiz.svg"
import ChevronRight from "../../../assets/icons/hero-icons/chevron-right.svg"

const { width } = Dimensions.get("screen")

type Props = {
  fund: FundWithMeta
}

const previewScale = (width - 16 * 2) / width

export default function FundDetailContent({ fund }: Props) {
  const navigation = useRootBottomTabNavigation()
  const { close } = useBottomSheet()

  const ProgressBars = CategoryProgressBars[fund.fundType]
  const { contentContainerStyle, handleStyle, style } = useStyles()

  return (
    <Animated.View
      className="bg-violet1 flex-1 overflow-hidden rounded-[20px] px-4 pb-4"
      style={style}
    >
      <Animated.View
        pointerEvents="none"
        style={handleStyle}
        className="h-6 items-center justify-center"
      >
        <View className="bg-mauve5 h-1 w-[27px] rounded-full" />
      </Animated.View>

      <Animated.View style={contentContainerStyle}>
        <View className="mb-10 h-10 flex-row items-center justify-between pt-4">
          <View className="flex-row items-center">
            <View
              className={clsx(
                "bg-violet4 mr-2 aspect-square w-12 items-center justify-center rounded-full",
                fund.fundType === "NON_NEGOTIABLE" && "bg-lime4",
              )}
            >
              <Ellipsis
                width={24}
                height={24}
                strokeWidth={3}
                // TODO: fix this
                color={
                  fund.fundType === "SPENDING" ? violet.violet8 : lime.lime8
                }
              />
            </View>

            <View>
              <Text className="text-mauve12 font-satoshi-bold text-lg">
                {fund.name}
              </Text>
              <Text className="text-mauve9 font-satoshi text-sm">
                {fundTypeReadableText[fund.fundType]}
              </Text>
            </View>
          </View>
          <Dropdown />
        </View>

        <ActionButton fund={fund} />

        <View className="mt-10">
          {/* <Text className="font-satoshi text-mauve9 text-sm"> */}
          {/*   <Text className="font-nunito-semibold"> */}
          {/*     {toCurrencyNarrow(fund.totalBudgetedAmount - fund.totalSpent)} */}
          {/*   </Text>{" "} */}
          {/*   Available for spending */}
          {/* </Text> */}
          <HelperText fund={fund} />

          <ProgressBars fund={fund} />
        </View>

        {/* details / rows */}
        <View className="mt-8 space-y-2">
          <View className="flex-row items-center justify-between">
            <Text className="font-satoshi-bold text-mauve9 mr-auto text-base">
              Total Budgeted Amount
            </Text>
            <Text className="font-nunito-bold text-mauve9 text-base">
              {toCurrencyNarrow(fund.totalBudgetedAmount)}
            </Text>

            <View className="ml-3 aspect-square w-6"></View>
          </View>
          <ScaleDownPressable
            className="flex-row items-center justify-between"
            opacity={0.6}
            scale={1}
            onPress={() => {
              close()
              navigation.navigate("TransactionsList", {
                fundId: fund.id,
                fundName: fund.name,
              })
            }}
          >
            <Text className="font-satoshi-medium text-mauve9 mr-auto text-base">
              Total Spent this month
            </Text>
            <Text className="font-nunito-semibold text-mauve9 text-base">
              {toCurrencyNarrow(fund.totalSpent)}
            </Text>

            <View className="bg-mauve3 ml-3 aspect-square w-6 items-center justify-center rounded-md">
              <ChevronRight
                width={15}
                height={15}
                strokeWidth={3}
                color={mauve.mauve8}
              />
            </View>
          </ScaleDownPressable>
          {/* <ScaleDownPressable */}
          {/*   className="flex-row items-center justify-between" */}
          {/*   scale={1} */}
          {/*   opacity={0.6} */}
          {/* > */}
          {/*   <Text className="font-satoshi-medium text-mauve9 mr-auto text-base"> */}
          {/*     Total Spent last month */}
          {/*   </Text> */}
          {/*   <Text className="font-nunito-semibold text-mauve9 text-base"> */}
          {/*     {toCurrencyNarrow(400)} */}
          {/*   </Text> */}
          {/**/}
          {/*   <View className="bg-mauve3 ml-3 aspect-square w-6 items-center justify-center rounded-md"> */}
          {/*     <ChevronRight */}
          {/*       width={15} */}
          {/*       height={15} */}
          {/*       strokeWidth={3} */}
          {/*       color={mauve.mauve8} */}
          {/*     /> */}
          {/*   </View> */}
          {/* </ScaleDownPressable> */}
        </View>

        <RecentTransactions fundId={fund.id} />
      </Animated.View>
    </Animated.View>
  )
}

function useStyles() {
  const { animatedIndex } = useBottomSheet()

  const style = useAnimatedStyle(() => ({
    width,
    transform: [
      {
        scale: interpolate(
          animatedIndex.value,
          [-1, 0, 1],
          [previewScale, previewScale, 1],
        ),
      },
    ],
  }))
  const handleStyle = useAnimatedStyle(() => ({
    opacity: interpolate(animatedIndex.value, [-1, 0, 1], [1, 1, 0]),
  }))
  const contentContainerStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: interpolate(animatedIndex.value, [-1, 0, 1], [0, 0, -24]) },
    ],
  }))

  return {
    style,
    handleStyle,
    contentContainerStyle,
  }
}

// TODO: dropdown
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
