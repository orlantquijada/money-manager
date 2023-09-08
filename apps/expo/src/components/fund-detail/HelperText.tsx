import { FC } from "react"

import type { FundWithMeta } from "~/types"

import { FundType } from ".prisma/client"
import SpendingHelperText from "./SpendingHelperText"
import NonNegotiableHelperText from "./NonNegotiableHelperText"
import TargetHelperText from "./TargetHelperText"

export type HelperTextProps = {
  fund: FundWithMeta
}

const TextMap: Record<FundType, FC<HelperTextProps>> = {
  SPENDING: SpendingHelperText,
  NON_NEGOTIABLE: NonNegotiableHelperText,
  TARGET: TargetHelperText,
}

export default function HelperText({ fund }: { fund: FundWithMeta }) {
  const Text = TextMap[fund.fundType]

  return <Text fund={fund} />
}
