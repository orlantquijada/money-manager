import { View } from "moti"
import { ComponentProps, PropsWithChildren } from "react"

// https://twitter.com/FernandoTheRojo/status/1520186163339968514

const DELAY = 80
const defaultAnimation: ComponentProps<typeof View> = {
  from: { opacity: 0, translateY: 4 },
  animate: { opacity: 1, translateY: 0 },
  exit: { opacity: 0, translateY: 0 },
}

type Props = PropsWithChildren<{
  style?: ComponentProps<typeof View>["style"]
  delayMultiplier?: number
  delay?: number
  exitDelayMultiplier?: number
}>

export default function Presence({
  style,
  children,
  delayMultiplier = 0,
  delay = DELAY,
  exitDelayMultiplier = 1,
}: Props) {
  return (
    <View
      style={style}
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
