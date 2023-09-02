import { Text } from "react-native"

import { useRootBottomTabNavigation } from "~/utils/hooks/useRootBottomTabNavigation"
import { mauve } from "~/utils/colors"

import Button from "../Button"
import ScaleDownPressable from "../ScaleDownPressable"
import { Fund } from ".prisma/client"
import { useBottomSheet } from "@gorhom/bottom-sheet"

//  TODO: better texts ani nila kay bati kayg mga pangan

export default function ActionButton({ fund }: { fund: Fund }) {
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
  else if (fund.fundType === "NON_NEGOTIABLE")
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
