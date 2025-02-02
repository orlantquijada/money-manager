import {
  BottomSheetFlatList,
  useBottomSheet,
  useBottomSheetModal,
} from "@gorhom/bottom-sheet"
import { memo, useMemo, useState } from "react"
import { Text, TextInput, View } from "react-native"
import { MotiView } from "moti"
import { Skeleton } from "moti/skeleton"
import clsx from "clsx"

import {
  debounce,
  getTotalBudgetedAmount,
  toCurrencyNarrow,
} from "~/utils/functions"
import { mauveDark } from "~/utils/colors"
import { trpc } from "~/utils/trpc"
import { useTransactionStore } from "~/utils/hooks/useTransactionStore"

import ScaleDownPressable from "../ScaleDownPressable"
import { Fund } from ".prisma/client"
import FundSectionList from "./FundSectionList"

import ChevronDownIcon from "../../../assets/icons/hero-icons/chevron-down.svg"
import CheckIcon from "../../../assets/icons/checkbox-circle-duo-dark.svg"

export function FundBottomSheetContent() {
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
          onPress={() => {
            dismiss()
          }}
          hitSlop={{
            top: 10,
            left: 10,
            right: 10,
            bottom: 10,
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
          placeholder="Search Funds"
          placeholderTextColor={mauveDark.mauve10}
          onChangeText={(text) => {
            setInput(text)
            handleDeferredSetInput(text)
          }}
        />
      </View>

      <MotiView
        className={"flex-1"}
        animate={{ opacity: deferredInput !== input ? 0.5 : 1 }}
      >
        {/* <FundList searchText={deferredInput} /> */}
        <FundSectionList searchText={deferredInput} />
      </MotiView>
    </View>
  )
}

// WARN: DEAD CODE
const FundList = memo(({ searchText }: { searchText: string }) => {
  const { data, status } = useFunds()

  const selectedFund = useTransactionStore((s) => s.fund)

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

  const handleSetFund = (newFund: Fund) => {
    useTransactionStore.setState({
      fund: newFund.id === selectedFund?.id ? undefined : newFund,
    })
    forceClose()
  }

  return (
    <BottomSheetFlatList
      keyboardShouldPersistTaps="always"
      data={filteredData}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => {
        const selected = item.id === selectedFund?.id
        const moneyLeft = item.totalBudgetedAmount - item.totalSpent

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
                handleSetFund(item)
              }}
              className="h-full flex-row items-center justify-between self-stretch px-4"
            >
              <Text className="text-mauveDark12 font-satoshi-medium text-base">
                {item.name}
              </Text>

              <View className="flex-row items-center gap-1">
                <View
                  className={clsx(
                    "h-8 justify-center rounded-lg px-2",
                    // moneyLeft > 0 && "bg-lime10",
                    // moneyLeft < 0 && "bg-red10",
                  )}
                >
                  <Text
                    className={clsx(
                      "font-nunito-medium text-sm",
                      moneyLeft > 0 && "text-limeDark10",
                      moneyLeft < 0 && "text-redDark10",
                    )}
                  >
                    {toCurrencyNarrow(moneyLeft)}
                  </Text>
                </View>

                {selected ? (
                  <CheckIcon color={mauveDark.mauve12} width={20} height={20} />
                ) : null}
              </View>
            </ScaleDownPressable>
          </View>
        )
      }}
    />
  )
})
FundList.displayName = "FundList"

function useFunds() {
  return trpc.fund.list.useQuery(undefined, {
    select: (funds) => {
      return funds.map((fund) => ({
        ...fund,
        totalBudgetedAmount: getTotalBudgetedAmount(fund),
      }))
    },
  })
}
