import { mergeAnimateProp, MotiPressable } from "moti/interactions"
import { styled } from "nativewind"
import { ComponentProps } from "react"

type Props = ComponentProps<typeof MotiPressable>

function ScaleDownPressable(props: Props) {
  const { animate, ...rest } = props

  return (
    <MotiPressable
      {...rest}
      transition={{ type: "timing", duration: 150 }}
      animate={(interaction) => {
        "worklet"

        return mergeAnimateProp(interaction, animate, {
          scale: interaction.pressed ? 0.96 : 1,
        })
      }}
    />
  )
}

export default styled(ScaleDownPressable)
