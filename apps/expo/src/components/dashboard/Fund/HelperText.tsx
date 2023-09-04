import { FC } from "react"

import type { FundWithMeta } from "~/types"
import useToggle from "~/utils/hooks/useToggle"

import ScaleDownPressable from "~/components/ScaleDownPressable"

import { FundType } from ".prisma/client"
import SpendingHelperText from "./SpendingHelperText"
import NonNegotiableHelperText from "./NonNegotiableHelperText"
import TargetHelperText from "./TargetHelperText"

export type HelperTextProps = {
  showDefault?: boolean
  fund: FundWithMeta
}

const TextMap: Record<FundType, FC<HelperTextProps>> = {
  SPENDING: SpendingHelperText,
  NON_NEGOTIABLE: NonNegotiableHelperText,
  TARGET: TargetHelperText,
}

export default function HelperText({ fund }: { fund: FundWithMeta }) {
  const [showDefault, { toggle }] = useToggle(true)

  const Text = TextMap[fund.fundType]

  return (
    <ScaleDownPressable
      scale={1}
      opacity={0.7}
      onPress={toggle}
      hitSlop={{
        top: 10,
        left: 10,
        right: 10,
        bottom: 10,
      }}
    >
      <Text fund={fund} showDefault={showDefault} />
    </ScaleDownPressable>
  )
}
