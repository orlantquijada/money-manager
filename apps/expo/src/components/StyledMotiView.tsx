import { ComponentPropsWithoutRef, ElementRef, forwardRef } from "react"
import { MotiView } from "moti"
import { styled } from "nativewind"

export type StyledMotiViewProps = ComponentPropsWithoutRef<typeof MotiView>
const StyledMotiView = forwardRef<
  ElementRef<typeof MotiView>,
  StyledMotiViewProps
>((props, ref) => {
  return <MotiView {...props} ref={ref} />
})
StyledMotiView.displayName = "StyledMotiView"

export default styled(StyledMotiView)
