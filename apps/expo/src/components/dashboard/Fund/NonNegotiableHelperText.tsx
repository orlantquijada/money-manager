import type { FC } from "react";
import { Text } from "react-native";
import { mauve, pink } from "~/utils/colors";
import { toCurrencyNarrow } from "~/utils/functions";
import type { HelperTextProps } from "./HelperText";

const NonNegotiableHelperText: FC<HelperTextProps> = ({
  showDefault,
  fund,
}) => {
  // is funded?
  const isFunded = fund.totalBudgetedAmount === fund.totalSpent;
  if (showDefault) {
    return (
      <Text
        className="mt-1 font-satoshi text-xs"
        style={{ color: isFunded ? mauve.mauve9 : pink.pink8 }}
      >
        {isFunded ? (
          // TODO: is the copy better nga completed or fully funded?
          "completed"
        ) : (
          <>
            <Text className="font-nunito-semibold">
              {toCurrencyNarrow(Number(fund.budgetedAmount))}{" "}
            </Text>
            more needed
          </>
        )}
      </Text>
    );
  }

  return (
    <Text
      className="mt-1 font-satoshi text-xs"
      style={{ color: isFunded ? mauve.mauve9 : pink.pink8 }}
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
  );
};

export default NonNegotiableHelperText;
