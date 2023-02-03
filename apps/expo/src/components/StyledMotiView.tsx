import { ComponentProps, forwardRef } from "react"
import { MotiView } from "moti"
import { styled } from "nativewind"

const StyledMotiView = forwardRef<
  typeof MotiView,
  ComponentProps<typeof MotiView>
>((props, ref) => {
  return <MotiView {...props} ref={ref} />
})

export default styled(StyledMotiView)
