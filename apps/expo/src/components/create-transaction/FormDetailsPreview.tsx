import { memo, useEffect } from "react"
import { Pressable, Text, View } from "react-native"
import { MotiText, MotiView, useAnimationState } from "moti"
import clsx from "clsx"
import { format } from "date-fns"

import { mauveDark, redDark } from "~/utils/colors"
import { formatRelativeDate } from "~/utils/functions"
import {
  HandlePresentModalPress,
  useTransactionStore,
} from "~/utils/hooks/useTransactionStore"

import ChevronUpIcon from "../../../assets/icons/hero-icons/chevron-up.svg"
import ScaleDownPressable from "../ScaleDownPressable"

export const FormDetailsPreview = ({
  handlePresentModalPress,
  openStoreListBottomSheet,
  openFundListBottomSheet,
}: {
  handlePresentModalPress: HandlePresentModalPress
  openFundListBottomSheet: () => void
  openStoreListBottomSheet: () => void
}) => {
  const store = useTransactionStore((s) => s.store)
  const note = useTransactionStore((s) => s.note)

  return (
    <View className="relative mb-4 items-center">
      <MotiView
        className="absolute -top-6"
        from={{
          translateY: -10,
        }}
        animate={{ translateY: 0 }}
        transition={{
          loop: true,
          type: "timing",
          duration: 1700,
          delay: 500,
        }}
      >
        <Pressable
          onPress={() => {
            handlePresentModalPress()
          }}
          hitSlop={32}
        >
          <ChevronUpIcon
            color={mauveDark.mauve11}
            height={24}
            width={24}
            strokeWidth={3}
          />
        </Pressable>
      </MotiView>

      <View className="border-b-mauveDark5 h-10 w-full flex-row items-center border-b">
        <DateSection handlePresentModalPress={handlePresentModalPress} />
        <Text className="text-mauveDark11 font-satoshi-bold mx-4 text-base leading-6">
          ·
        </Text>
        <ScaleDownPressable
          className="h-full shrink justify-center"
          onPress={() => {
            handlePresentModalPress("note")
          }}
        >
          <Text
            numberOfLines={1}
            className={clsx(
              "font-satoshi-bold shrink text-base leading-6",
              note ? "text-mauveDark12" : "text-mauveDark11",
            )}
          >
            {note || "Add Note"}
          </Text>
        </ScaleDownPressable>
      </View>
      <View className="border-b-mauveDark5 h-10 w-full flex-row items-center border-b">
        <ScaleDownPressable
          className="h-full justify-center"
          onPress={openStoreListBottomSheet}
        >
          <Text
            className={clsx(
              "font-satoshi-bold text-base leading-6",
              store ? "text-mauveDark12" : "text-mauveDark11",
            )}
          >
            {store || "Store"}
          </Text>
        </ScaleDownPressable>

        <Text className="text-mauveDark11 font-satoshi-bold mx-4 text-base leading-6">
          ·
        </Text>

        <FundSection openFundListBottomSheet={openFundListBottomSheet} />
      </View>
    </View>
  )
}
FormDetailsPreview.displayName = "FormDetailsPreview"

function DateSection({
  handlePresentModalPress,
}: {
  handlePresentModalPress: HandlePresentModalPress
}) {
  const createdAt = useTransactionStore((s) => s.createdAt)

  const formattedDate = formatRelativeDate(createdAt, new Date())

  return (
    <ScaleDownPressable
      className="h-full justify-center"
      onPress={() => {
        handlePresentModalPress("createdAt")
      }}
    >
      <Text className="text-mauveDark12 font-satoshi-bold text-base leading-6">
        {formattedDate} at {format(createdAt, "K:mm aa")}
      </Text>
    </ScaleDownPressable>
  )
}

const FundSection = memo(
  ({ openFundListBottomSheet }: { openFundListBottomSheet: () => void }) => {
    const fund = useTransactionStore((s) => s.fund)
    const submitTimestamp = useTransactionStore((s) => s.submitTimestamp)

    const offset = 4

    const state = useAnimationState({
      from: {
        color: mauveDark.mauve11,
      },
      hasFund: {
        color: mauveDark.mauve12,
      },
      shake: {
        color: redDark.red11,
        translateX: [0, offset, -offset, offset, 0],
      },
    })

    useEffect(() => {
      if (submitTimestamp && !fund) state.transitionTo("shake")
      else state.transitionTo(fund ? "hasFund" : "from")
    }, [fund, state, submitTimestamp])

    return (
      <ScaleDownPressable
        className="h-full justify-center"
        onPress={openFundListBottomSheet}
      >
        <MotiText
          className="font-satoshi-bold text-base leading-6"
          state={state}
          // animate={
          //   didSumit && !fund
          //     ? {
          //         // @ts-expect-error idk
          //         color: redDark.red11,
          //         translateX: [0, offset, -offset, offset, 0],
          //       }
          //     : {
          //         color: fund ? mauveDark.mauve12 : mauveDark.mauve11,
          //       }
          // }
          // TODO: make it move faster
          transition={{
            translateX: { type: "timing", duration: 120 },
          }}
        >
          {fund?.name || "Fund"}
        </MotiText>
      </ScaleDownPressable>
    )
  },
)
FundSection.displayName = "FundSection"
