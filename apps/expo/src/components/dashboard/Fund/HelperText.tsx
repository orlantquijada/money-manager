import type { FundType } from ".prisma/client";
import type { FC } from "react";
import ScaleDownPressable from "~/components/ScaleDownPressable";
import type { FundWithMeta } from "~/types";
import useToggle from "~/utils/hooks/useToggle";
import NonNegotiableHelperText from "./NonNegotiableHelperText";
import SpendingHelperText from "./SpendingHelperText";
import TargetHelperText from "./TargetHelperText";

export type HelperTextProps = {
  showDefault?: boolean;
  fund: FundWithMeta;
};

const TextMap: Record<FundType, FC<HelperTextProps>> = {
  SPENDING: SpendingHelperText,
  NON_NEGOTIABLE: NonNegotiableHelperText,
  TARGET: TargetHelperText,
};

export default function HelperText({ fund }: { fund: FundWithMeta }) {
  const [showDefault, { toggle }] = useToggle(true);

  const Text = TextMap[fund.fundType];

  return (
    <ScaleDownPressable
      hitSlop={{
        top: 10,
        left: 10,
        right: 10,
        bottom: 10,
      }}
      onPress={toggle}
      opacity={0.7}
      scale={1}
    >
      <Text fund={fund} showDefault={showDefault} />
    </ScaleDownPressable>
  );
}
