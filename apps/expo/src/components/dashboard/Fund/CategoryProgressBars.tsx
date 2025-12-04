import type { FundType } from "api";
import type { FC } from "react";
import type { FundWithMeta } from "~/types";
import NonNegotiableProgressBars from "./NonNegotiableProgressBars";
import SpendingProgressBars from "./SpendingProgressBars";
import TargetProgressBars from "./TargetProgressBars";

type Props = {
  fund: FundWithMeta;
};

const CategoryProgressBars: Record<FundType, FC<Props>> = {
  SPENDING: SpendingProgressBars,
  TARGET: TargetProgressBars,
  NON_NEGOTIABLE: NonNegotiableProgressBars,
};
export default CategoryProgressBars;
