import { useRef } from "react"
import { View, Text } from "react-native"
import { getWeekOfMonth, isThisMonth } from "date-fns"
import { BottomSheetModal } from "@gorhom/bottom-sheet"

import { toCurrencyNarrow } from "~/utils/functions"
import { mauve, pink } from "~/utils/colors"
import useToggle from "~/utils/hooks/useToggle"
import { FundWithMeta } from "~/types"

import ScaleDownPressable from "./ScaleDownPressable"
import FundDetailBottomSheet from "./fund-detail/FundDetailBottomSheet"
import type { TimeMode } from ".prisma/client"

import CategoryProgressBars from "./CategoryProgressBars"

export const CATEGORY_HEIGHT = 56

type CategoryProps = {
  fund: FundWithMeta
}
export default function Category({ fund }: CategoryProps) {
  const ref = useRef<BottomSheetModal>(null)

  return (
    <>
      <ScaleDownPressable
        className="justify-center px-4"
        style={{ height: CATEGORY_HEIGHT }}
        onPress={() => {
          ref.current?.present()
        }}
      >
        <View className="flex-row justify-between">
          <Text className="font-satoshi-medium text-violet12 text-base">
            {fund.name}
          </Text>

          <HelperText fund={fund} />
        </View>

        <CategoryProgressBars fund={fund} />
      </ScaleDownPressable>
      {/* FIX: bottom sheet re-showing up after closing */}
      <FundDetailBottomSheet ref={ref} fund={fund} />
    </>
  )
}

function HelperText({ fund }: { fund: FundWithMeta }) {
  const relativeOverspentValue = getRelativeOverspentValue(fund)
  const didRelativeOverspend = relativeOverspentValue < 0
  const didMonthlyOverspend = getDidMonthlyOverspent(fund)
  const [showDefault, { toggle }] = useToggle(true)

  return (
    <ScaleDownPressable
      scale={1}
      opacity={0.7}
      onPress={toggle}
      hitSlop={{
        top: 10,
        left: 10,
        right: 10,
        bottom: 10,
      }}
    >
      {showDefault ? (
        <Text
          className="font-satoshi mt-1 text-xs"
          style={{ color: didRelativeOverspend ? pink.pink8 : mauve.mauve9 }}
        >
          {didRelativeOverspend ? (
            <>
              overspent
              <Text className="font-nunito-semibold">
                {" "}
                {toCurrencyNarrow(relativeOverspentValue * -1)}{" "}
              </Text>
              {`${helperTextTimeModeMap[fund.timeMode]}`.trim()}
            </>
          ) : (
            <>
              <Text className="font-nunito-semibold">
                {toCurrencyNarrow(
                  Number(fund.budgetedAmount) - fund.totalSpent,
                )}{" "}
              </Text>
              {`left ${helperTextTimeModeMap[fund.timeMode]}`.trim()}
            </>
          )}
        </Text>
      ) : (
        <Text
          className="font-satoshi mt-1 text-xs"
          style={{ color: didMonthlyOverspend ? pink.pink8 : mauve.mauve9 }}
        >
          <>
            spent
            <Text className="font-nunito">
              {" "}
              {toCurrencyNarrow(fund.totalSpent)}{" "}
            </Text>
            of
            <Text className="font-nunito-semibold">
              {" "}
              {toCurrencyNarrow(fund.totalBudgetedAmount)}
            </Text>{" "}
            <Text className="font-nunito">
              ({Math.ceil((fund.totalSpent / fund.totalBudgetedAmount) * 100)}
              %)
            </Text>
          </>
        </Text>
      )}
    </ScaleDownPressable>
  )
}

function getDidMonthlyOverspent(fund: FundWithMeta) {
  return fund.totalBudgetedAmount < fund.totalSpent
}

// relative to current date and timemode
function getRelativeOverspentValue(fund: FundWithMeta) {
  const now = new Date()

  if (fund.timeMode === "MONTHLY" || fund.timeMode === "EVENTUALLY")
    return fund.totalBudgetedAmount - fund.totalSpent
  else if (fund.timeMode === "WEEKLY") {
    const weekOfMonth = getWeekOfMonth(now)
    if (isThisMonth(fund.createdAt || now)) {
      return (
        (getWeekOfMonth(now) - getWeekOfMonth(fund.createdAt || now) + 1) *
          Number(fund.budgetedAmount) -
        fund.totalSpent
      )
    }
    return weekOfMonth * Number(fund.budgetedAmount) - fund.totalSpent
  }

  return (
    (Number(!(now.getDay() < 15)) + 1) * Number(fund.budgetedAmount) -
    fund.totalSpent
  )
}

const helperTextTimeModeMap: Record<TimeMode, string> = {
  WEEKLY: "this week",
  MONTHLY: "this month",
  BIMONTHLY: "",
  EVENTUALLY: "",
}
