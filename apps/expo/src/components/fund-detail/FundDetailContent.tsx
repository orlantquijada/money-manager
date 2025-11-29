import { useBottomSheet } from "@gorhom/bottom-sheet";
import clsx from "clsx";
import { Dimensions, Text, View } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";
import * as DropdownMenu from "zeego/dropdown-menu";

import type { FundWithMeta } from "~/types";
import { lime, mauve, violet } from "~/utils/colors";
import { fundTypeReadableText } from "~/utils/constants";
import { toCurrencyNarrow } from "~/utils/functions";
import { useRootBottomTabNavigation } from "~/utils/hooks/useRootBottomTabNavigation";
import ChevronRight from "../../../assets/icons/hero-icons/chevron-right.svg";
// import Ellipsis from "../../../assets/icons/hero-icons/ellipsis-horizontal.svg"
import Ellipsis from "../../../assets/icons/more-horiz.svg";
import CategoryProgressBars from "../dashboard/Fund/CategoryProgressBars";
import ScaleDownPressable from "../ScaleDownPressable";
import ActionButton from "./ActionButton";
import HelperText from "./HelperText";
import RecentTransactions from "./RecentTransactions";

const { width } = Dimensions.get("screen");

type Props = {
  fund: FundWithMeta;
};

const previewScale = (width - 16 * 2) / width;

export default function FundDetailContent({ fund }: Props) {
  const navigation = useRootBottomTabNavigation();
  const { close } = useBottomSheet();

  const ProgressBars = CategoryProgressBars[fund.fundType];
  const { contentContainerStyle, handleStyle, style } = useStyles();

  return (
    <Animated.View
      className="flex-1 overflow-hidden rounded-[20px] bg-violet1 px-4 pb-4"
      style={style}
    >
      <Animated.View
        className="h-6 items-center justify-center"
        pointerEvents="none"
        style={handleStyle}
      >
        <View className="h-1 w-[27px] rounded-full bg-mauve5" />
      </Animated.View>

      <Animated.View style={contentContainerStyle}>
        <View className="mb-10 h-10 flex-row items-center justify-between pt-4">
          <View className="flex-row items-center">
            <View
              className={clsx(
                "mr-2 aspect-square w-12 items-center justify-center rounded-full bg-violet4",
                fund.fundType === "NON_NEGOTIABLE" && "bg-lime4"
              )}
            >
              <Ellipsis
                color={
                  fund.fundType === "SPENDING" ? violet.violet8 : lime.lime8
                }
                height={24}
                strokeWidth={3}
                // TODO: fix this
                width={24}
              />
            </View>

            <View>
              <Text className="font-satoshi-bold text-lg text-mauve12">
                {fund.name}
              </Text>
              <Text className="font-satoshi text-mauve9 text-sm">
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
            <Text className="mr-auto font-satoshi-bold text-base text-mauve9">
              Total Budgeted Amount
            </Text>
            <Text className="font-nunito-bold text-base text-mauve9">
              {toCurrencyNarrow(fund.totalBudgetedAmount)}
            </Text>

            <View className="ml-3 aspect-square w-6" />
          </View>
          <ScaleDownPressable
            className="flex-row items-center justify-between"
            onPress={() => {
              close();
              navigation.navigate("TransactionsList", {
                fundId: fund.id,
                fundName: fund.name,
              });
            }}
            opacity={0.6}
            scale={1}
          >
            <Text className="mr-auto font-satoshi-medium text-base text-mauve9">
              Total Spent this month
            </Text>
            <Text className="font-nunito-semibold text-base text-mauve9">
              {toCurrencyNarrow(fund.totalSpent)}
            </Text>

            <View className="ml-3 aspect-square w-6 items-center justify-center rounded-md bg-mauve3">
              <ChevronRight
                color={mauve.mauve8}
                height={15}
                strokeWidth={3}
                width={15}
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
  );
}

function useStyles() {
  const { animatedIndex } = useBottomSheet();

  const style = useAnimatedStyle(() => ({
    width,
    transform: [
      {
        scale: interpolate(
          animatedIndex.value,
          [-1, 0, 1],
          [previewScale, previewScale, 1]
        ),
      },
    ],
  }));
  const handleStyle = useAnimatedStyle(() => ({
    opacity: interpolate(animatedIndex.value, [-1, 0, 1], [1, 1, 0]),
  }));
  const contentContainerStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: interpolate(animatedIndex.value, [-1, 0, 1], [0, 0, -24]) },
    ],
  }));

  return {
    style,
    handleStyle,
    contentContainerStyle,
  };
}

// TODO: dropdown
function Dropdown() {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <ScaleDownPressable
          className="aspect-square w-6 items-center justify-center rounded-md bg-mauve3"
          scale={0.9}
        >
          <Ellipsis
            color={mauve.mauve8}
            height={15}
            strokeWidth={3}
            width={15}
          />
        </ScaleDownPressable>
      </DropdownMenu.Trigger>

      <DropdownMenu.Content>
        <DropdownMenu.Label>Label</DropdownMenu.Label>
        <DropdownMenu.Item
          destructive
          key="item 1"
          onSelect={() => {
            console.log("wow");
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
  );
}
