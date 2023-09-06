import { FundWithMeta } from "~/types"

import SpendingProgressBars from "./SpendingProgressBars"
import NonNegotiableProgressBars from "./NonNegotiableProgressBars"
import TargetProgressBars from "./TargetProgressBars"
import { FundType } from ".prisma/client"
import { FC } from "react"

type Props = {
  fund: FundWithMeta
}

const CategoryProgressBars: Record<FundType, FC<Props>> = {
  SPENDING: SpendingProgressBars,
  TARGET: TargetProgressBars,
  NON_NEGOTIABLE: NonNegotiableProgressBars,
}
export default CategoryProgressBars
