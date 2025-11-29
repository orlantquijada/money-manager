import { MotiPressable, mergeAnimateProp } from "moti/interactions";
import { styled } from "nativewind";
import type { ComponentProps } from "react";

export type ScaleDownPressableProps = ComponentProps<typeof MotiPressable> & {
  scale?: number;
  opacity?: number;
};

function ScaleDownPressable(props: ScaleDownPressableProps) {
  const { animate, scale = 0.96, opacity = 1, ...rest } = props;

  return (
    <MotiPressable
      {...rest}
      animate={(interaction) => {
        "worklet";

        return mergeAnimateProp(interaction, animate, {
          scale: interaction.pressed ? scale : 1,
          opacity: interaction.pressed ? opacity : 1,
        });
      }}
      transition={{ type: "timing", duration: 150 }}
    />
  );
}

export default styled(ScaleDownPressable);
