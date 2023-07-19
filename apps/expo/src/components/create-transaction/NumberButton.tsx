import { ComponentProps, PropsWithChildren, useMemo } from "react"
import { Text, View } from "react-native"
import { MotiPressable } from "moti/interactions"
import { styled } from "nativewind"

import { transitions } from "~/utils/motion"

const StyledMotiPressable = styled(MotiPressable)

export function NumberButton({
  children,
  style,
  ...rest
}: PropsWithChildren<ComponentProps<typeof StyledMotiPressable>>) {
  return (
    <StyledMotiPressable
      {...rest}
      // @ts-expect-error asdasd
      containerStyle={[style, { height: 64, width: "33.33%", flexShrink: 1 }]}
      animate={useMemo(
        () =>
          ({ pressed }) => {
            "worklet"

            return {
              scale: pressed ? 1.4 : 1,
            }
          },
        [],
      )}
      transition={transitions.snappy}
      className="h-full w-full"
    >
      <View className="h-full w-full items-center justify-center">
        <Text className="font-nunito-bold text-mauveDark12 text-2xl">
          {children}
        </Text>
      </View>
    </StyledMotiPressable>
  )
}
