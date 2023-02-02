import { type ComponentProps } from "react"
import clsx from "clsx"
import { MotiView } from "moti"
import { styled } from "nativewind"

import { mauveDark } from "~/utils/colors"

const StyledMotiView = styled(MotiView)
type Props = {
  disabled?: boolean
} & ComponentProps<typeof StyledMotiView>

// only a UI comp does not actually do what a button does
// wrap this with a <Pressable /> to have button functionality
export default function Button({ className, disabled, ...rest }: Props) {
  return (
    <StyledMotiView
      className={clsx(
        "h-8 justify-center rounded-xl px-4 transition-colors",
        className,
      )}
      animate={{
        backgroundColor: disabled ? mauveDark.mauve11 : mauveDark.mauve12,
        ...rest.animate,
      }}
      transition={{
        backgroundColor: { type: "timing", duration: 200 },
        ...rest.transition,
      }}
      {...rest}
    />
  )
}
