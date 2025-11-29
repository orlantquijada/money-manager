import type { FC } from "react";
import { Text } from "react-native";
import { toCurrencyNarrow } from "~/utils/functions";
import type { HelperTextProps } from "./HelperText";

// TODO: mo error color ra siya if nalapas sa deadline? not sure
const TargetHelperText: FC<HelperTextProps> = ({ fund }) => {
  const isOverFunded = fund.totalSpent > fund.totalBudgetedAmount;
  return (
    <Text className="font-satoshi text-mauve9 text-sm">
      {isOverFunded ? (
        <>
          funded
          <Text className="font-nunito-semibold">
            {" "}
            {toCurrencyNarrow(
              (Number(fund.budgetedAmount) - fund.totalSpent) * -1
            )}{" "}
          </Text>
          more than target
        </>
      ) : (
        <>
          <Text className="font-nunito-semibold">
            {toCurrencyNarrow(
              Number(fund.budgetedAmount) - fund.totalSpent
            )}{" "}
          </Text>
          more needed funding
        </>
      )}
    </Text>
  );
};

export default TargetHelperText;
