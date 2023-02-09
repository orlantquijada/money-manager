import clsx from "clsx"
import { MotiView } from "moti"
import { MotiPressable } from "moti/interactions"
import { ComponentProps, PropsWithChildren } from "react"
import { View, Text, Pressable } from "react-native"

import CheckboxIcon from "../../../assets/icons/checkbox-circle.svg"

type Props = PropsWithChildren<{
  choiceLabel: string
  selected?: boolean
  className?: string
}> &
  Omit<ComponentProps<typeof MotiPressable>, "children">

export default function Choice({
  choiceLabel,
  children,
  selected,
  ...rest
}: Props) {
  return (
    <Pressable {...rest}>
      <MotiView
        from={{ opacity: 1 }}
        animate={selected ? { opacity: [0.7, 1, 0.7, 1] } : {}}
        exit={{ opacity: 1 }}
        transition={{ type: "timing", duration: 120 }}
      >
        <View
          className={clsx(
            "bg-mauveDark4 flex h-10 flex-row items-center justify-between rounded-xl px-2",
            selected && "bg-mauveDark12",
          )}
        >
          <View className="flex flex-row">
            <View
              className={clsx(
                "bg-mauveDark12 mr-2 flex h-6 w-6 items-center justify-center rounded-lg",
                selected && "bg-mauveDark4",
              )}
            >
              <Text
                className={clsx(
                  "font-satoshi-bold text-mauveDark1 flex items-center justify-center text-center text-sm leading-[18px]",
                  selected && "text-mauveDark12",
                )}
              >
                {choiceLabel}
              </Text>
            </View>

            <Text
              className={clsx(
                "font-satoshi text-mauveDark12 text-base",
                selected && "text-mauveDark1",
              )}
            >
              {children}
            </Text>
          </View>

          {selected ? <CheckboxIcon /> : null}
        </View>
      </MotiView>
    </Pressable>
  )
}
