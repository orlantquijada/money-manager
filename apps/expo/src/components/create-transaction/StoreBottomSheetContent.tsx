import {
  BottomSheetFlatList,
  useBottomSheet,
  useBottomSheetModal,
} from "@gorhom/bottom-sheet"
import { memo, useMemo, useState } from "react"
import { Text, TextInput, View } from "react-native"
import { MotiPressable } from "moti/interactions"
import { MotiView } from "moti"
import { Skeleton } from "moti/skeleton"
import clsx from "clsx"

import { debounce } from "~/utils/functions"
import { mauveDark, violet } from "~/utils/colors"
import { trpc } from "~/utils/trpc"
import { useTransactionStore } from "~/utils/hooks/useTransactionStore"

import { Store } from ".prisma/client"
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
          scale={0.9}
          opacity={0.5}
          hitSlop={{
            top: 10,
            left: 10,
            right: 10,
            bottom: 10,
          }}
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
          placeholder="Search or add Store"
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
  const { data, status } = trpc.store.list.useQuery(undefined, {
    staleTime: 1000 * 60 * 5,
  })
  const utils = trpc.useContext()

  // data from create-transaction
  const funds = utils.fund.list.getData()

  const formDataStore = useTransactionStore((s) => s.store)

  const animate = useMemo(
    () =>
      ({ pressed }: { pressed: boolean }) => {
        "worklet"

        return {
          backgroundColor: pressed ? mauveDark.mauve6 : mauveDark.mauve4,
        }
      },
    [],
  )

  const { forceClose } = useBottomSheet()

  if (status !== "success")
    return (
      <View>
        <View className="h-12 justify-center px-4">
          <Skeleton
            width={200}
            height={20}
            colorMode="light"
            colors={[mauveDark.mauve4, mauveDark.mauve6]}
          />
        </View>
        <View className="h-12 justify-center px-4">
          <Skeleton
            width={180}
            height={20}
            colorMode="light"
            colors={[mauveDark.mauve4, mauveDark.mauve6]}
          />
        </View>
        <View className="h-12 justify-center px-4">
          <Skeleton
            width={240}
            height={20}
            colorMode="light"
            colors={[mauveDark.mauve4, mauveDark.mauve6]}
          />
        </View>
      </View>
    )

  const filteredData = searchText
    ? data.filter(({ name }) =>
        name.toLowerCase().includes(searchText.toLowerCase()),
      )
    : data

  const finalData =
    !searchText &&
    formDataStore &&
    !data.some(({ name }) => name === formDataStore)
      ? [
          ...filteredData,
          { id: -1, name: formDataStore, lastSelectedFundId: null },
        ]
      : filteredData

  const hasNoStore = data.length === 0

  const handleSetStore = (newStore: string | Omit<Store, "userId">) => {
    let storeName = typeof newStore === "string" ? newStore : newStore.name
    if (storeName === formDataStore) storeName = ""

    useTransactionStore.setState((prev) => {
      return {
        store: storeName,
        fund:
          typeof newStore !== "string" &&
          prev.lastSelectedFund === undefined &&
          newStore.lastSelectedFundId
            ? funds?.find((fund) => fund.id === newStore.lastSelectedFundId)
            : prev.fund,
      }
    })
    forceClose()
  }

  return (
    <View className="flex-1">
      {searchText && !finalData.map(({ name }) => name).includes(searchText) ? (
        <MotiPressable
          onPress={() => {
            handleSetStore(searchText)
          }}
          animate={animate}
          transition={{ type: "timing", duration: 250 }}
          style={{ marginBottom: 8 }}
        >
          <View className="h-16 flex-row items-center px-4">
            <PlusIcon width={20} height={20} color={violet.violet8} />

            <Text className="text-violet8 font-satoshi-medium ml-2 text-base">
              Add &quot;{searchText}&quot; Store
            </Text>
          </View>
        </MotiPressable>
      ) : null}

      <BottomSheetFlatList
        keyboardShouldPersistTaps="always"
        data={finalData}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          const selected = item.name === formDataStore

          return (
            <View
              className={clsx(
                "h-12",
                selected ? "bg-mauveDark4" : "bg-transparent",
              )}
            >
              <ScaleDownPressable
                scale={0.98}
                onPress={() => {
                  handleSetStore(item)
                }}
                className="h-full flex-row items-center justify-between self-stretch px-4"
              >
                <Text className="text-mauveDark12 font-satoshi-medium text-base">
                  {item.name}
                </Text>
                {selected ? (
                  <CheckIcon color={mauveDark.mauve12} width={20} height={20} />
                ) : null}
              </ScaleDownPressable>
            </View>
          )
        }}
        ListEmptyComponent={() => (
          <View>
            {hasNoStore ? (
              <View className="mb-4 px-4">
                <Text className="text-mauveDark12 font-satoshi text-base">
                  <Text className="font-satoshi-bold underline">Stores</Text>{" "}
                  give you a little more information about an expense; It can be
                  what you bought, or where you had it, like{" "}
                  <Text className="font-satoshi-bold-italic text-mauveDark11">
                    Jollibee
                  </Text>
                  .
                </Text>

                <Text className="text-mauveDark12 font-satoshi mt-4 text-base">
                  Start typing to add a store.
                </Text>
              </View>
            ) : null}
          </View>
        )}
      />
    </View>
  )
})
StoreList.displayName = "StoreList"
