import { FC } from "react"
import { Text } from "react-native"
import { mauve, pink } from "~/utils/colors"
import { toCurrencyNarrow } from "~/utils/functions"
import { HelperTextProps } from "./HelperText"

const NonNegotiableHelperText: FC<HelperTextProps> = ({
  showDefault,
  fund,
}) => {
  // is funded?
  const isFunded = fund.totalBudgetedAmount === fund.totalSpent
  if (showDefault)
    return (
      <Text
        className="font-satoshi mt-1 text-xs"
        style={{ color: !isFunded ? pink.pink8 : mauve.mauve9 }}
      >
        {isFunded ? (
          "fully funded"
        ) : (
          <>
            <Text className="font-nunito-semibold">
              {toCurrencyNarrow(Number(fund.budgetedAmount))}{" "}
            </Text>
            more needed
          </>
        )}
      </Text>
    )

  return (
    <Text
      className="font-satoshi mt-1 text-xs"
      style={{ color: !isFunded ? pink.pink8 : mauve.mauve9 }}
    >
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

export default NonNegotiableHelperText
