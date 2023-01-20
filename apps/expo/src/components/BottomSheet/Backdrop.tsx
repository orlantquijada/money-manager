import { BottomSheetBackdrop as GBottomSheetBackdrop } from "@gorhom/bottom-sheet"
import { ComponentProps } from "react"
import { mauveA } from "~/utils/colors"

export default function BottomSheetBackdrop({
  style,
  ...props
}: ComponentProps<typeof GBottomSheetBackdrop>) {
  return (
    <GBottomSheetBackdrop
      {...props}
      style={[{ backgroundColor: mauveA.mauveA9 }, style]}
    />
  )
}
