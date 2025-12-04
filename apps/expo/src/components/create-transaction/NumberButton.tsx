import { MotiPressable } from "moti/interactions";
// import { styled } from "nativewind";
import { type ComponentProps, type PropsWithChildren, useMemo } from "react";
import { Text, View } from "react-native";

import { transitions } from "~/utils/motion";

// const StyledMotiPressable = styled(MotiPressable);
const StyledMotiPressable = MotiPressable;

export function NumberButton({
  children,
  style,
  ...rest
}: PropsWithChildren<ComponentProps<typeof StyledMotiPressable>>) {
  return (
    <StyledMotiPressable
      {...rest}
      animate={useMemo(
        () =>
          ({ pressed }) => {
            "worklet";

            return {
              scale: pressed ? 1.4 : 1,
            };
          },
        []
      )}
      // className="h-full w-full"
      // containerStyle={[style, { height: 64, width: "33.33%", flexShrink: 1 }]}
      transition={transitions.snappy}
    >
      <View className="h-full w-full items-center justify-center">
        <Text className="font-nunito-bold text-2xl text-mauveDark12">
          {children}
        </Text>
      </View>
    </StyledMotiPressable>
  );
}
