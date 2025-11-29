import type { FC } from "react";
import { Text } from "react-native";
import { toCurrencyNarrow } from "~/utils/functions";
import type { HelperTextProps } from "./HelperText";

const NonNegotiableHelperText: FC<HelperTextProps> = ({ fund }) => {
  // is funded?
  const isFunded = fund.totalSpent >= fund.totalBudgetedAmount;

  return (
    <Text className="font-satoshi text-mauve9 text-sm">
      {isFunded ? (
        "completed"
      ) : (
        <>
          <Text className="font-nunito-semibold">
            {toCurrencyNarrow(fund.totalBudgetedAmount)}
          </Text>{" "}
          more needed funding
        </>
      )}
    </Text>
  );
};

export default NonNegotiableHelperText;
