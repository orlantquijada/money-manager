import { View } from "moti"
import { ComponentProps, PropsWithChildren } from "react"

// https://twitter.com/FernandoTheRojo/status/1520186163339968514

const DELAY = 40
const defaultAnimation: ComponentProps<typeof View> = {
  from: { opacity: 0, translateY: 4 },
  animate: { opacity: 1, translateY: 0 },
  exit: { opacity: 0, translateY: 0 },
}

type Props = PropsWithChildren<{
  delayMultiplier?: number
  style?: ComponentProps<typeof View>["style"]
}>

export default function Presence({
  style,
  children,
  delayMultiplier = 0,
}: Props) {
  return (
    <View style={style} delay={delayMultiplier * DELAY} {...defaultAnimation}>
      {children}
    </View>
  )
}
