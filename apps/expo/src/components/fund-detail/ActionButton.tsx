import { Text, View } from "react-native"

import { useRootBottomTabNavigation } from "~/utils/hooks/useRootBottomTabNavigation"
import { amber, limeDark, mauve } from "~/utils/colors"

import Button from "../Button"
import ScaleDownPressable from "../ScaleDownPressable"
import { useBottomSheet } from "@gorhom/bottom-sheet"
import type { FundWithMeta } from "~/types"

import CheckboxCircle from "../../../assets/icons/hero-icons/check-circle-mini-solid.svg"
import { progressBarColors } from "~/utils/constants"

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
    return <NonNegotiableActionButton fund={fund} />
  }

  return <TargetActionButton fund={fund} />
}

function NonNegotiableActionButton({ fund }: { fund: FundWithMeta }) {
  const navigation = useRootBottomTabNavigation()
  const { close } = useBottomSheet()

  const isFullyFunded = fund.totalSpent >= fund.totalBudgetedAmount

  if (isFullyFunded)
    return (
      <ScaleDownPressable>
        <Button
          className="h-10"
          animate={{
            backgroundColor: progressBarColors.NON_NEGOTIABLE,
          }}
        >
          <View className="absolute left-0 opacity-80">
            <CheckboxCircle width={20} height={20} color={limeDark.lime11} />
          </View>
          <Text
            className="font-satoshi-medium"
            style={{ color: limeDark.lime11, opacity: 0.8 }}
          >
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

function TargetActionButton({ fund }: { fund: FundWithMeta }) {
  const navigation = useRootBottomTabNavigation()
  const { close } = useBottomSheet()

  const isFullyFunded = fund.totalSpent >= fund.totalBudgetedAmount

  if (isFullyFunded)
    return (
      <ScaleDownPressable
        onPress={() => {
          close()
          navigation.navigate("AddTransaction", {
            fundId: fund.id,
          })
        }}
      >
        <Button
          className="h-10"
          animate={{ backgroundColor: progressBarColors.TARGET }}
        >
          <View className="absolute left-0">
            <CheckboxCircle width={20} height={20} color={amber.amber7} />
          </View>
          <Text className="font-satoshi-medium" style={{ color: amber.amber7 }}>
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
