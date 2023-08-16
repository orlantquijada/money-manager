import { mergeAnimateProp, MotiPressable } from "moti/interactions"
import { styled } from "nativewind"
import { ComponentProps } from "react"

type Props = ComponentProps<typeof MotiPressable> & {
  scale?: number
  opacity?: number
}

function ScaleDownPressable(props: Props) {
  const { animate, scale = 0.96, opacity = 1, ...rest } = props

  return (
    <MotiPressable
      {...rest}
      transition={{ type: "timing", duration: 150 }}
      animate={(interaction) => {
        "worklet"

        return mergeAnimateProp(interaction, animate, {
          scale: interaction.pressed ? scale : 1,
          opacity: interaction.pressed ? opacity : 1,
        })
      }}
    />
  )
}

export default styled(ScaleDownPressable)
