import { Dispatch, SetStateAction, useCallback, useEffect, useRef } from "react"
import { Dimensions, Text, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { BottomSheetModal } from "@gorhom/bottom-sheet"
import { useFocusEffect } from "@react-navigation/native"

import { mauveDark } from "~/utils/colors"
import { useRootBottomTabNavigation } from "~/utils/hooks/useRootBottomTabNavigation"
import { trpc } from "~/utils/trpc"
import {
  BottomSheetData,
  HandlePresentModalPress,
  useTransactionStore,
} from "~/utils/hooks/useTransactionStore"
import { useRootBottomTabRoute } from "~/utils/hooks/useRootBottomTabRoute"

import SafeAreaView from "~/components/SafeAreaView"
import ScaleDownPressable from "~/components/ScaleDownPressable"
import Button from "~/components/Button"
import { Amount, useAmount } from "~/components/create-transaction/Amount"
import { Numpad } from "~/components/create-transaction/Numpad"
import TransactionCreateBottomSheet from "~/components/create-transaction/CreateBottomSheet"
import StoreListBottomSheet from "~/components/create-transaction/StoreBottomSheet"
import FundListBottomSheet from "~/components/create-transaction/FundListBottomSheet"
import { FormDetailsPreview } from "~/components/create-transaction/FormDetailsPreview"
// import TransactionFlowChoices from "~/components/create-transaction/TransactionFlowChoices"

import CrossIcon from "../../assets/icons/hero-icons/x-mark.svg"

const { height: screenHeight } = Dimensions.get("screen")

// TODO: layout does not fit on small screens
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

          <ScaleDownPressable
            scale={0.85}
            hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
            className="aspect-square w-8 items-center justify-center"
            onPress={() => navigation.goBack()}
          >
            <CrossIcon
              color={mauveDark.mauve12}
              height={24}
              width={24}
              strokeWidth={3}
            />
          </ScaleDownPressable>
        </View>

        <CreateTransactionForm />
      </View>
    </SafeAreaView>
  )
}

// TODO: also reset date
function useSetInitialState({
  setAmount,
}: {
  setAmount: Dispatch<SetStateAction<string>>
}) {
  const route = useRootBottomTabRoute("AddTransaction")
  const funds = trpc.fund.list.useQuery(undefined, {
    staleTime: 1000 * 60 * 60 * 24,
  })
  const reset = useTransactionStore((s) => s.reset)
  const navigation = useRootBottomTabNavigation()

  useFocusEffect(
    useCallback(() => {
      if (route.params?.fundId || route.params?.amount) {
        reset({
          fund:
            funds.status === "success" && route.params.fundId
              ? funds.data.find(({ id }) => id === route.params?.fundId)
              : undefined,
          amount: route.params.amount || 0,
        })
        if (route.params.amount) setAmount(route.params.amount.toString())
      }
      return () => navigation.setParams(undefined)
    }, [
      funds.data,
      funds.status,
      navigation,
      reset,
      route.params?.fundId,
      route.params?.amount,
      setAmount,
    ]),
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

  useSetInitialState({ setAmount })

  return (
    <>
      <View
        className="relative flex-grow items-center justify-center"
        style={{ minHeight: screenHeight * 0.25 }}
      >
        <Amount amount={amount} />

        <View className="absolute top-0 w-3/5 translate-y-2 self-center">
          {/* <TransactionFlowChoices /> */}
        </View>
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
  )
  const reset = useTransactionStore((s) => s.reset)
  const createTransaction = useCreateTransaction()
  const navigation = useRootBottomTabNavigation()
  const utils = trpc.useContext()

  const isLoading = createTransaction.status === "loading"

  return (
    <ScaleDownPressable
      disabled={isLoading}
      onPress={() => {
        useTransactionStore.setState({ submitTimestamp: new Date().getTime() })
        if (formValues.fundId) {
          createTransaction.mutate(
            {
              ...formValues,
              amount: formValues.amount,
              fundId: formValues.fundId,
            },
            {
              onSuccess: () => {
                Promise.all([
                  // utils.fund.list.invalidate(),
                  // utils.folder.listWithFunds.invalidate(),
                  utils.fund.invalidate(),
                  utils.folder.invalidate(),
                  utils.transaction.invalidate(),
                  utils.store.list.invalidate(),
                ]).then(() => {
                  navigation.navigate("Home", { screen: "Budgets" })
                  reset()
                  resetAmount()
                })
              },
            },
          )
        }
      }}
    >
      <Button className="h-12 w-full rounded-2xl" loading={isLoading}>
        <Text className="text-mauveDark1 font-satoshi-bold text-lg leading-6">
          Save
        </Text>
      </Button>
    </ScaleDownPressable>
  )
}

function useCreateTransaction() {
  const utils = trpc.useContext()
  return trpc.transaction.create.useMutation({
    onSuccess: () => {
      // utils.folder.list.invalidate()
      // utils.transaction.allThisMonth.invalidate()
      // utils.transaction.countByFund.invalidate()
    },
  })
}
