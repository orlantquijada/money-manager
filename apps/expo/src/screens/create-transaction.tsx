import { useCallback, useEffect, useRef } from "react"
import { Pressable, Text, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { BottomSheetModal } from "@gorhom/bottom-sheet"
import { shallow } from "zustand/shallow"

import { mauveDark } from "~/utils/colors"
import { useRootBottomTabNavigation } from "~/utils/hooks/useRootBottomTabNavigation"
import { trpc } from "~/utils/trpc"
import {
  BottomSheetData,
  HandlePresentModalPress,
  useTransactionStore,
} from "~/utils/hooks/useTransactionStore"
import { userId } from "~/utils/constants"

import SafeAreaView from "~/components/SafeAreaView"
import ScaleDownPressable from "~/components/ScaleDownPressable"
import Button from "~/components/Button"
import { Amount, useAmount } from "~/components/create-transaction/Amount"
import { Numpad } from "~/components/create-transaction/Numpad"
import TransactionCreateBottomSheet from "~/components/create-transaction/CreateBottomSheet"
import StoreListBottomSheet from "~/components/create-transaction/StoreBottomSheet"
import FundListBottomSheet from "~/components/create-transaction/FundListBottomSheet"
import { FormDetailsPreview } from "~/components/create-transaction/FormDetailsPreview"

import CrossIcon from "../../assets/icons/hero-icons/x-mark.svg"

export default function CreateTransaction() {
  // show default insets since tabbar isn't shown on this screen
  const insets = useSafeAreaInsets()
  const navigation = useRootBottomTabNavigation()

  return (
    <SafeAreaView className="bg-mauveDark1 flex-1" insets={insets}>
      <View className="flex-1 px-4 pb-8">
        <View className="mt-8 h-10 w-full flex-row items-center justify-between">
          <Text className="font-satoshi-bold text-mauveDark12 text-2xl">
            Add Expense
          </Text>

          <Pressable
            className="aspect-square w-8 items-center justify-center"
            onPress={() => navigation.goBack()}
          >
            <CrossIcon
              color={mauveDark.mauve12}
              height={24}
              width={24}
              strokeWidth={3}
            />
          </Pressable>
        </View>

        <CreateTransactionForm />
      </View>
    </SafeAreaView>
  )
}

function CreateTransactionForm() {
  const handlePresentModalPress: HandlePresentModalPress = useCallback(
    (data) => {
      bottomSheetModalRef.current?.present()
      bottomSheetDataRef.current = data
    },
    [],
  )
  const [amount, setAmount, resetAmount] = useAmount(0)
  const storeListBottomSheetRef = useRef<BottomSheetModal>(null)
  const fundListBottomSheetRef = useRef<BottomSheetModal>(null)
  const bottomSheetModalRef = useRef<BottomSheetModal>(null)
  const bottomSheetDataRef = useRef<BottomSheetData>()

  const openFundListBottomSheet = useCallback(() => {
    fundListBottomSheetRef.current?.present()
  }, [])
  const openStoreListBottomSheet = useCallback(() => {
    storeListBottomSheetRef.current?.present()
  }, [])

  useEffect(() => {
    useTransactionStore.setState({ amount })
  }, [amount])

  return (
    <>
      <View className="flex-grow items-center justify-center">
        <Amount amount={amount} />
      </View>

      <FormDetailsPreview
        handlePresentModalPress={handlePresentModalPress}
        openStoreListBottomSheet={openStoreListBottomSheet}
        openFundListBottomSheet={openFundListBottomSheet}
      />

      <Numpad setAmount={setAmount} className="mb-8" />

      <CreateTransactionButton resetAmount={resetAmount} />

      <TransactionCreateBottomSheet
        ref={bottomSheetModalRef}
        bottomSheetDataRef={bottomSheetDataRef}
        openStoreListBottomSheet={openStoreListBottomSheet}
        openFundListBottomSheet={openFundListBottomSheet}
      />

      <StoreListBottomSheet ref={storeListBottomSheetRef} />
      <FundListBottomSheet ref={fundListBottomSheetRef} />
    </>
  )
}

function CreateTransactionButton({ resetAmount }: { resetAmount: () => void }) {
  const formValues = useTransactionStore(
    ({ note, store, createdAt, fund, amount }) => ({
      note,
      store,
      date: createdAt.toJSON(),
      fundId: fund?.id,
      amount,
    }),
    shallow,
  )
  const reset = useTransactionStore((s) => s.reset)
  const createTransaction = useCreateTransaction()
  const navigation = useRootBottomTabNavigation()

  return (
    <ScaleDownPressable
      onPress={() => {
        useTransactionStore.setState({ didSumit: true })
        if (formValues.fundId) {
          createTransaction.mutate(
            {
              ...formValues,
              fundId: formValues.fundId,
              userId,
            },
            {
              onSuccess: () => {
                reset()
                resetAmount()
                navigation.navigate("Transactions")
              },
            },
          )
        }
      }}
    >
      <Button className="h-12 w-full rounded-2xl">
        <Text className="text-mauveDark1 font-satoshi-bold text-lg leading-6">
          Save
        </Text>
      </Button>
    </ScaleDownPressable>
  )
}

function useCreateTransaction() {
  return trpc.transaction.create.useMutation()
}
