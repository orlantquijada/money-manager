import type { RouterOutputs } from "api";

import { ScalePressable } from "@/components/scale-pressable";
import { StyledLeanText } from "@/config/interop";

type Transaction = RouterOutputs["transaction"]["allThisMonth"][number];

type Props = {
  transaction: Transaction;
  onPress?: () => void;
};

export function TransactionRow({ transaction, onPress }: Props) {
  const amount = Number(transaction.amount);
  const txnLabel =
    transaction.store?.name || transaction.note || transaction.fund.name;

  return (
    <ScalePressable
      className="flex-row items-center justify-between py-3"
      onPress={onPress}
      opacityValue={0.7}
      scaleValue={0.98}
    >
      <StyledLeanText
        className="flex-1 font-satoshi-medium text-base text-foreground"
        ellipsizeMode="tail"
        numberOfLines={1}
      >
        {txnLabel}
      </StyledLeanText>

      <StyledLeanText className="font-satoshi text-base text-foreground">
        ₱{amount.toLocaleString()}
      </StyledLeanText>
    </ScalePressable>
  );
}
