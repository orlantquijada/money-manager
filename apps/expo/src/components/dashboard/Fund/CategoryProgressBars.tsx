import { FundWithMeta } from "~/types"

import SpendingProgressBars from "./SpendingProgressBars"
import NonNegotiableProgressBars from "./NonNegotiableProgressBars"
import TargetProgressBars from "./TargetProgressBars"

export default function CategoryProgressBars({ fund }: { fund: FundWithMeta }) {
  if (fund.fundType === "SPENDING") return <SpendingProgressBars fund={fund} />
  else if (fund.fundType === "NON_NEGOTIABLE")
    return <NonNegotiableProgressBars fund={fund} />
  return <TargetProgressBars fund={fund} />
}
