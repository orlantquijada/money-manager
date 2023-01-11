import {
  BottomSheetBackdropProps,
  BottomSheetBackdrop as GBottomSheetBackdrop,
} from "@gorhom/bottom-sheet"
import { mauveA } from "~/utils/colors"

export default function BottomSheetBackdrop({
  style,
  ...props
}: BottomSheetBackdropProps) {
  return (
    <GBottomSheetBackdrop
      {...props}
      style={{
        backgroundColor: mauveA.mauveA9,
        ...(style as Record<string, unknown>),
      }}
    />
  )
}
