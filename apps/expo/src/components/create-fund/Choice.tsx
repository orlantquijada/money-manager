import clsx from "clsx";
import { MotiView } from "moti";
import type { MotiPressable } from "moti/interactions";
import type { ComponentProps, PropsWithChildren } from "react";
import { Pressable, Text, View } from "react-native";

// import CheckboxIcon from "../../../assets/icons/checkbox-circle.svg";

type Props = PropsWithChildren<{
  choiceLabel: string;
  selected?: boolean;
  className?: string;
}> &
  Omit<ComponentProps<typeof MotiPressable>, "children">;

export default function Choice({
  choiceLabel,
  children,
  selected,
  ...rest
}: Props) {
  return (
    <Pressable {...rest}>
      <MotiView
        animate={selected ? { opacity: [0.7, 1, 0.7, 1] } : {}}
        exit={{ opacity: 1 }}
        from={{ opacity: 1 }}
        transition={{ type: "timing", duration: 120 }}
      >
        <View
          className={clsx(
            "flex h-10 flex-row items-center justify-between rounded-xl bg-mauveDark4 px-2",
            selected && "bg-mauveDark12"
          )}
        >
          <View className="flex flex-row">
            <View
              className={clsx(
                "mr-2 flex h-6 w-6 items-center justify-center rounded-lg bg-mauveDark12",
                selected && "bg-mauveDark4"
              )}
            >
              <Text
                className={clsx(
                  "flex items-center justify-center text-center font-satoshi-bold text-mauveDark1 text-sm leading-[18px]",
                  selected && "text-mauveDark12"
                )}
              >
                {choiceLabel}
              </Text>
            </View>

            <Text
              className={clsx(
                "font-satoshi text-base text-mauveDark12",
                selected && "text-mauveDark1"
              )}
            >
              {children}
            </Text>
          </View>

          {/* {selected ? <CheckboxIcon /> : null} */}
        </View>
      </MotiView>
    </Pressable>
  );
}
