import {
  BottomSheetFlatList,
  useBottomSheet,
  useBottomSheetModal,
} from "@gorhom/bottom-sheet"
import { memo, useMemo, useState } from "react"
import { Pressable, Text, TextInput, View } from "react-native"
import { MotiPressable } from "moti/interactions"
import { MotiView } from "moti"
import clsx from "clsx"

import { debounce } from "~/utils/functions"
import { mauveDark, violet } from "~/utils/colors"
import { trpc } from "~/utils/trpc"
import { useTransactionStore } from "~/utils/hooks/useTransactionStore"

import ScaleDownPressable from "../ScaleDownPressable"

import ChevronDownIcon from "../../../assets/icons/hero-icons/chevron-down.svg"
import PlusIcon from "../../../assets/icons/plus-rec-filled-dark.svg"
import CheckIcon from "../../../assets/icons/checkbox-circle-duo-dark.svg"

export function StoreBottomSheetContent() {
  const { dismiss } = useBottomSheetModal()

  const [input, setInput] = useState("")
  const [deferredInput, setDeferredInput] = useState("")

  const handleDeferredSetInput = useMemo(
    () =>
      debounce((text: string) => {
        setDeferredInput(text)
      }, 500),
    [],
  )

  return (
    <View className="flex-1">
      <View className="h-16 flex-row items-center justify-between px-4">
        <ScaleDownPressable
          onPress={() => {
            dismiss()
          }}
        >
          <ChevronDownIcon
            color={mauveDark.mauve12}
            width={20}
            height={20}
            strokeWidth={3}
          />
        </ScaleDownPressable>

        <TextInput
          className="font-satoshi-medium text-mauveDark12 ml-4 h-full grow text-xl"
          placeholder="Find or add Item"
          placeholderTextColor={mauveDark.mauve10}
          onChangeText={(text) => {
            setInput(text)
            handleDeferredSetInput(text)
          }}
        />

        {/* <ScaleDownPressable> */}
        {/*   <Button> */}
        {/*     <Text className="font-satoshi-medium text-mauve12 text-base"> */}
        {/*       Done */}
        {/*     </Text> */}
        {/*   </Button> */}
        {/* </ScaleDownPressable> */}
      </View>

      <MotiView
        className={"flex-1"}
        animate={{ opacity: deferredInput !== input ? 0.5 : 1 }}
      >
        <StoreList searchText={deferredInput} />
      </MotiView>
    </View>
  )
}

const StoreList = memo(({ searchText }: { searchText: string }) => {
  const { data } = trpc.store.listFromUserId.useQuery(
    "clk7zeudu0000t789z4fylgjc",
  )

  const store = useTransactionStore((s) => s.store)

  const filteredData =
    data && searchText
      ? data.filter(({ name }) =>
          name.toLowerCase().includes(searchText.toLowerCase()),
        )
      : data

  const animate = useMemo(
    () =>
      ({ pressed }: { pressed: boolean }) => {
        "worklet"

        return {
          backgroundColor: pressed ? mauveDark.mauve5 : mauveDark.mauve4,
        }
      },
    [],
  )

  const { forceClose } = useBottomSheet()

  return (
    <BottomSheetFlatList
      keyboardShouldPersistTaps="always"
      data={filteredData}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => {
        const selected = item.name === store

        return (
          <Pressable
            onPress={() => {
              new Promise((resolve) => {
                useTransactionStore.setState({ store: item.name })
                resolve(undefined)
              }).then(() => forceClose())
            }}
            className={clsx(
              "h-12 flex-row items-center justify-between px-4",
              selected ? "bg-mauveDark4" : "bg-transparent",
            )}
          >
            <Text className="text-mauveDark12 font-satoshi-medium text-base">
              {item.name}
            </Text>
            {selected ? (
              <CheckIcon color={mauveDark.mauve12} width={20} height={20} />
            ) : null}
          </Pressable>
        )
      }}
      ListEmptyComponent={() => (
        <MotiPressable
          onPress={() => {
            new Promise((resolve) => {
              useTransactionStore.setState({ store: searchText })
              resolve(undefined)
            }).then(() => forceClose())
          }}
          animate={animate}
          transition={{ type: "timing", duration: 250 }}
        >
          <View className="h-16 flex-row items-center px-4">
            <PlusIcon width={20} height={20} color={violet.violet8} />

            <Text className="text-violet8 font-satoshi-medium ml-2 text-base">
              Add &quot;{searchText}&quot; Store
            </Text>
          </View>
        </MotiPressable>
      )}
    />
  )
})
StoreList.displayName = "StoreList"
