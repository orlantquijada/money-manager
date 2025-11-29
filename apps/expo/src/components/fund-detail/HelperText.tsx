import type { FundType } from ".prisma/client";
import type { FC } from "react";
import type { FundWithMeta } from "~/types";
import NonNegotiableHelperText from "./NonNegotiableHelperText";
import SpendingHelperText from "./SpendingHelperText";
import TargetHelperText from "./TargetHelperText";

export type HelperTextProps = {
  fund: FundWithMeta;
};

const TextMap: Record<FundType, FC<HelperTextProps>> = {
  SPENDING: SpendingHelperText,
  NON_NEGOTIABLE: NonNegotiableHelperText,
  TARGET: TargetHelperText,
};

export default function HelperText({ fund }: { fund: FundWithMeta }) {
  const Text = TextMap[fund.fundType];

  return <Text fund={fund} />;
}
