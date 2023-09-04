import { FC } from "react"
import { Text } from "react-native"
import { mauve } from "~/utils/colors"
import { toCurrencyNarrow } from "~/utils/functions"
import { HelperTextProps } from "./HelperText"

const TargetHelperText: FC<HelperTextProps> = ({ showDefault, fund }) => {
  const isOverFunded = fund.totalSpent > fund.totalBudgetedAmount
  if (showDefault)
    return (
      <Text
        className="font-satoshi mt-1 text-xs"
        style={{ color: mauve.mauve9 }}
      >
        {isOverFunded ? (
          <>
            funded
            <Text className="font-nunito-semibold">
              {" "}
              {toCurrencyNarrow(
                (Number(fund.budgetedAmount) - fund.totalSpent) * -1,
              )}{" "}
            </Text>
            more than target
          </>
        ) : (
          <>
            <Text className="font-nunito-semibold">
              {toCurrencyNarrow(Number(fund.budgetedAmount) - fund.totalSpent)}{" "}
            </Text>
            more needed
          </>
        )}
      </Text>
    )

  return (
    <Text className="font-satoshi mt-1 text-xs" style={{ color: mauve.mauve9 }}>
      funded
      <Text className="font-nunito"> {toCurrencyNarrow(fund.totalSpent)} </Text>
      of
      <Text className="font-nunito-semibold">
        {" "}
        {toCurrencyNarrow(fund.totalBudgetedAmount)}
      </Text>{" "}
      <Text className="font-nunito">
        ({Math.ceil((fund.totalSpent / fund.totalBudgetedAmount) * 100)}
        %)
      </Text>
    </Text>
  )
}

export default TargetHelperText
