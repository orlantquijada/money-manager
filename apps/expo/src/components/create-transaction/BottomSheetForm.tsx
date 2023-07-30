import { RefObject, useMemo } from "react"
import { Pressable, Text, TextInput, View } from "react-native"
import {
  useBottomSheetModal,
  BottomSheetScrollView,
  BottomSheetModal,
} from "@gorhom/bottom-sheet"
import clsx from "clsx"

import { mauveDark } from "~/utils/colors"
import { debounce } from "~/utils/functions"
import {
  BottomSheetData,
  useTransactionStore,
} from "~/utils/hooks/useTransactionStore"

import ScaleDownPressable from "../ScaleDownPressable"
import DateSection from "./DateSection"

import ChevronDownIcon from "../../../assets/icons/hero-icons/chevron-down.svg"
import WalletIcon from "../../../assets/icons/wallet-duo.svg"
import NoteIcon from "../../../assets/icons/note-duo-dark.svg"

export default function BottomSheetForm({
  bottomSheetDataRef,
  storeListBottomSheetRef,
}: {
  bottomSheetDataRef: RefObject<BottomSheetData>
  storeListBottomSheetRef: RefObject<BottomSheetModal>
}) {
  const { dismissAll } = useBottomSheetModal()
  const store = useTransactionStore((s) => s.store)

  return (
    <BottomSheetScrollView>
      <View className="h-8 flex-row items-center justify-between px-4">
        <ScaleDownPressable onPress={dismissAll}>
          <ChevronDownIcon
            color={mauveDark.mauve12}
            width={20}
            height={20}
            strokeWidth={3}
          />
        </ScaleDownPressable>
      </View>

      <View className="border-b-mauveDark4 h-16 flex-row items-center border-b px-4">
        <View className="aspect-square w-5" />
        <Pressable
          className="ml-4 h-full grow justify-center"
          onPress={() => {
            storeListBottomSheetRef.current?.present()
          }}
        >
          <Text
            className={clsx(
              "font-satoshi-medium text-xl",
              store ? "text-mauveDark12" : "text-mauveDark10",
            )}
          >
            {store || "Store"}
          </Text>
        </Pressable>
      </View>

      <View className="border-b-mauveDark4 h-16 flex-row items-center border-b px-4">
        <WalletIcon width={20} height={20} />
        <TextInput
          className="font-satoshi-medium text-mauveDark12 ml-4 h-full grow"
          style={{ fontSize: 16 }}
          placeholder="Select Fund"
          placeholderTextColor={mauveDark.mauve10}
        />
      </View>

      <DateSection defaultOpen={bottomSheetDataRef.current === "createdAt"} />

      <NoteSection
      // NOTE: toggle this feature (honestly think its annoying to open keyboard directly)
      // autoFocus={bottomSheetDataRef.current === "note"}
      />
    </BottomSheetScrollView>
  )
}

function NoteSection({ autoFocus }: { autoFocus?: boolean }) {
  const note = useTransactionStore((s) => s.note)

  const handleDeferredSetNote = useMemo(
    () =>
      debounce((text: string) => {
        useTransactionStore.setState({
          note: text,
        })
      }, 500),
    [],
  )

  return (
    <View className="border-b-mauveDark4 min-h-[64px] flex-row items-center border-b px-4">
      <NoteIcon width={20} height={20} />
      <TextInput
        autoFocus={autoFocus}
        className="font-satoshi-medium text-mauveDark12 ml-4 h-full shrink grow"
        style={{ fontSize: 16 }}
        placeholder="Add Note"
        placeholderTextColor={mauveDark.mauve10}
        defaultValue={note}
        onChangeText={handleDeferredSetNote}
      />
    </View>
  )
}
