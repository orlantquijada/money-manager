import { RefObject, useMemo } from "react"
import { Text, TextInput, View } from "react-native"
import {
  useBottomSheetModal,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet"

import { mauveDark } from "~/utils/colors"
import { debounce } from "~/utils/functions"
import { BottomSheetData, FormContext } from "./context"

import Button from "../Button"
import ScaleDownPressable from "../ScaleDownPressable"
import DateSection from "./DateSection"

import CrossIcon from "../../../assets/icons/hero-icons/x-mark.svg"
import WalletIcon from "../../../assets/icons/wallet-duo.svg"
import NoteIcon from "../../../assets/icons/note-duo-dark.svg"

export default function BottomSheetForm({
  setFormValues,
  formData,
  bottomSheetDataRef,
}: FormContext & {
  bottomSheetDataRef: RefObject<BottomSheetData>
}) {
  const { dismissAll } = useBottomSheetModal()

  return (
    <BottomSheetScrollView>
      <View className="flex-row items-center justify-between px-4">
        <ScaleDownPressable onPress={dismissAll}>
          <CrossIcon
            color={mauveDark.mauve12}
            width={20}
            height={20}
            strokeWidth={3}
          />
        </ScaleDownPressable>

        <Button>
          <Text className="font-satoshi-medium text-mauve12 text-base">
            Save
          </Text>
        </Button>
      </View>

      <View className="border-b-mauveDark4 h-16 flex-row items-center border-b px-4">
        <View className="aspect-square w-5" />
        <TextInput
          className="font-satoshi-medium text-mauveDark12 ml-4 h-full grow text-xl"
          placeholder="Store or Item"
          placeholderTextColor={mauveDark.mauve10}
        />
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

      <DateSection
        setFormValues={setFormValues}
        formData={formData}
        defaultOpen={bottomSheetDataRef.current === "createdAt"}
      />

      <NoteSection
        setFormValues={setFormValues}
        formData={formData}
        // NOTE: toggle this feature (honestly think its annoying to open keyboard directly)
        // autoFocus={bottomSheetDataRef.current === "note"}
      />
    </BottomSheetScrollView>
  )
}

function NoteSection({
  setFormValues,
  formData,
  autoFocus,
}: FormContext & { autoFocus?: boolean }) {
  const handleDeferredSetNote = useMemo(
    () =>
      debounce((text: string) => {
        setFormValues({
          note: text,
        })
      }, 500),
    [setFormValues],
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
        defaultValue={formData.note}
        onChangeText={handleDeferredSetNote}
      />
    </View>
  )
}
