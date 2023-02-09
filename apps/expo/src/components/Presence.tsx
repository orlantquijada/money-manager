import { type ComponentProps, type PropsWithChildren } from "react"
import { View } from "moti"

// https://twitter.com/FernandoTheRojo/status/1520186163339968514

type ViewProps = ComponentProps<typeof View>

const DELAY = 80
const defaultAnimation: ViewProps = {
  from: { opacity: 0, translateY: 4 },
  animate: { opacity: 1, translateY: 0 },
  exit: { opacity: 0, translateY: 0 },
}

type Props = PropsWithChildren<{
  delayMultiplier?: number
  delay?: number
  exitDelayMultiplier?: number
}> &
  Pick<ViewProps, "style" | "className">

export default function Presence({
  style,
  className = "",
  children,
  delayMultiplier = 0,
  delay = DELAY,
  exitDelayMultiplier = 1,
}: Props) {
  return (
    <View
      style={style}
      className={className}
      delay={delayMultiplier * delay}
      {...defaultAnimation}
      exitTransition={
        exitDelayMultiplier === undefined
          ? { delay: delay * exitDelayMultiplier }
          : {}
      }
    >
      {children}
    </View>
  )
}
