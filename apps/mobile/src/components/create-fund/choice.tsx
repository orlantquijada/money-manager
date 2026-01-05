import type { ReactNode } from "react";
import { Text, View } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import { CheckboxCircle } from "@/icons";
import { cn } from "@/utils/cn";
import { flicker } from "@/utils/motion";
import {
  AnimatedPressable,
  type AnimatedPressableProps,
} from "../animated-pressable";

type Props = {
  choiceLabel: string | ReactNode;
  selected?: boolean;
  children?: ReactNode;
} & Pick<AnimatedPressableProps, "onPress">;

export default function Choice({
  choiceLabel,
  selected,
  children,
  onPress,
}: Props) {
  const opacity = useSharedValue(1);

  return (
    <AnimatedPressable
      onPress={(e) => {
        opacity.set(flicker());

        if (typeof onPress === "function") {
          onPress?.(e);
        }
      }}
      style={{ opacity }}
    >
      <View
        className={cn(
          "flex h-10 flex-row items-center justify-between rounded-xl bg-muted px-2",
          selected && "bg-foreground"
        )}
        style={{ borderCurve: "continuous" }}
      >
        <View className="flex flex-row">
          <View
            className={cn(
              "mr-2 flex h-6 w-6 items-center justify-center rounded-lg bg-foreground",
              selected && "bg-muted"
            )}
            style={{ borderCurve: "continuous" }}
          >
            <Text
              className={cn(
                "flex items-center justify-center text-center font-satoshi-bold text-background text-sm",
                selected && "text-foreground"
              )}
            >
              {choiceLabel}
            </Text>
          </View>

          <Text
            className={cn(
              "font-satoshi text-base text-foreground",
              selected && "text-background"
            )}
          >
            {children}
          </Text>
        </View>

        {selected && <CheckboxCircle />}
      </View>
    </AnimatedPressable>
  );
}
