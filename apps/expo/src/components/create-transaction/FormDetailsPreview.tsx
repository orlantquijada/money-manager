import { Pressable, Text, View } from "react-native"
import { MotiText, MotiView } from "moti"
import clsx from "clsx"
import { format, formatRelative } from "date-fns"

import { mauveDark, redDark } from "~/utils/colors"
import { capitalize } from "~/utils/functions"
import {
  HandlePresentModalPress,
  useTransactionStore,
} from "~/utils/hooks/useTransactionStore"

import ChevronUpIcon from "../../../assets/icons/hero-icons/chevron-up.svg"

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
        <Pressable
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
        </Pressable>
      </View>
      <View className="border-b-mauveDark5 h-10 w-full flex-row items-center border-b">
        <Pressable
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
        </Pressable>

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

  const formattedDate = formatRelative(createdAt, new Date())
  let [date, time] = formattedDate.split(" at ")

  // NOTE: does not include year
  // TODO: include year if not this year
  date = date?.includes("/") ? format(createdAt, "MMM d") : date
  time = time || format(createdAt, "K:mm aa")

  return (
    <Pressable
      className="h-full justify-center"
      onPress={() => {
        handlePresentModalPress("createdAt")
      }}
    >
      <Text className="text-mauveDark12 font-satoshi-bold text-base leading-6">
        {capitalize(date || "")} at {time}
      </Text>
    </Pressable>
  )
}

const FundSection = ({
  openFundListBottomSheet,
}: {
  openFundListBottomSheet: () => void
}) => {
  const fund = useTransactionStore((s) => s.fund)
  const didSumit = useTransactionStore((s) => s.didSumit)

  const offset = 4

  return (
    <Pressable
      className="h-full justify-center"
      onPress={openFundListBottomSheet}
    >
      <MotiText
        className="font-satoshi-bold text-base leading-6"
        animate={
          didSumit && !fund
            ? {
                // @ts-expect-error idk
                color: redDark.red11,
                translateX: [0, offset, -offset, offset, 0],
              }
            : {
                color: fund ? mauveDark.mauve12 : mauveDark.mauve11,
              }
        }
        transition={{
          translateX: { type: "timing", duration: 200 },
        }}
      >
        {fund?.name || "Fund"}
      </MotiText>
    </Pressable>
  )
}
FundSection.displayName = "FundSection"
