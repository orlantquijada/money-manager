import clsx from "clsx"
import { MotiView, useAnimationState } from "moti"
import { MotiPressable } from "moti/interactions"
import { ComponentProps, PropsWithChildren } from "react"
import { View, Text, Pressable } from "react-native"
import useToggle from "~/utils/hooks/useToggle"

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
  // selected = false,
  className,
  style,
  ...rest
}: Props) {
  const [selected, { toggle }] = useToggle()

  const state = useAnimationState({
    from: { opacity: 1 },
    select: { opacity: [0.7, 1, 0.7, 1] },
    unselect: {},
  })

  return (
    <Pressable
      onPress={() => {
        if (state.current === "select") state.transitionTo("unselect")
        else state.transitionTo("select")

        toggle()
      }}
    >
      <MotiView state={state} transition={{ type: "timing", duration: 120 }}>
        <View
          className={clsx(
            "bg-mauveDark4 flex h-10 flex-row items-center justify-between rounded-xl px-2",
            selected && "bg-mauveDark12",
            className,
          )}
          style={style}
          {...rest}
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
