import { Text, View } from "react-native"

import { useRootBottomTabNavigation } from "~/utils/hooks/useRootBottomTabNavigation"
import { lime, limeDark, mauve } from "~/utils/colors"

import Button from "../Button"
import ScaleDownPressable from "../ScaleDownPressable"
import { useBottomSheet } from "@gorhom/bottom-sheet"
import type { FundWithMeta } from "~/types"

import CheckboxCircle from "../../../assets/icons/hero-icons/check-circle-mini-solid.svg"

//  TODO: better texts ani nila kay bati kayg mga pangan

export default function ActionButton({ fund }: { fund: FundWithMeta }) {
  const navigation = useRootBottomTabNavigation()
  const { close } = useBottomSheet()

  if (fund.fundType === "SPENDING")
    return (
      <ScaleDownPressable
        onPress={() => {
          close()
          navigation.navigate("AddTransaction", { fundId: fund.id })
        }}
      >
        <Button className="h-10" animate={{ backgroundColor: mauve.mauve3 }}>
          <Text className="font-satoshi-medium text-mauve10">Add Expense</Text>
        </Button>
      </ScaleDownPressable>
    )
  else if (fund.fundType === "NON_NEGOTIABLE") {
    const isFullyFunded = fund.totalSpent >= fund.totalBudgetedAmount

    if (isFullyFunded)
      return (
        <ScaleDownPressable>
          <Button
            className="h-10"
            animate={{
              backgroundColor: lime.lime4,
            }}
          >
            <View className="absolute left-0">
              <CheckboxCircle width={20} height={20} color={limeDark.lime11} />
            </View>
            <Text className={"font-satoshi-medium text-limeDark11"}>
              Completed
            </Text>
          </Button>
        </ScaleDownPressable>
      )

    return (
      <ScaleDownPressable
        onPress={() => {
          close()
          navigation.navigate("AddTransaction", {
            fundId: fund.id,
            amount: Number(fund.budgetedAmount),
          })
        }}
      >
        <Button className="h-10" animate={{ backgroundColor: mauve.mauve3 }}>
          <Text className="font-satoshi-medium text-mauve10">Auto Fund</Text>
        </Button>
      </ScaleDownPressable>
    )
  }

  return (
    <ScaleDownPressable
      onPress={() => {
        close()
        navigation.navigate("AddTransaction", {
          fundId: fund.id,
        })
      }}
    >
      <Button className="h-10" animate={{ backgroundColor: mauve.mauve3 }}>
        <Text className="font-satoshi-medium text-mauve10">
          Add Transaction
        </Text>
      </Button>
    </ScaleDownPressable>
  )
}
