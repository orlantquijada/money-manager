import { RefObject, useCallback, useRef } from "react"
import { Pressable, Text, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { BottomSheetModal } from "@gorhom/bottom-sheet"
import { format, formatRelative } from "date-fns"
import { MotiView } from "moti"
import clsx from "clsx"

import { mauveDark } from "~/utils/colors"
import { useRootBottomTabNavigation } from "~/utils/hooks/useRootBottomTabNavigation"
// import { trpc } from "~/utils/trpc"
import { capitalize } from "~/utils/functions"
import {
  FormProvider,
  useFormData,
  HandlePresentModalPress,
  BottomSheetData,
} from "~/components/create-transaction/context"

import SafeAreaView from "~/components/SafeAreaView"
import ScaleDownPressable from "~/components/ScaleDownPressable"
import Button from "~/components/Button"
import { Amount, useAmount } from "~/components/create-transaction/Amount"
import { Numpad } from "~/components/create-transaction/Numpad"
import TransactionCreateBottomSheet from "~/components/create-transaction/CreateBottomSheet"

import CrossIcon from "../../assets/icons/hero-icons/x-mark.svg"
import ChevronUpIcon from "../../assets/icons/hero-icons/chevron-up.svg"
import StoreListBottomSheet from "~/components/create-transaction/StoreBottomSheet"

export default function CreateTransaction() {
  // show default insets since tabbar isn't shown on this screen
  const insets = useSafeAreaInsets()
  const insetsRef = useRef(insets)
  const navigation = useRootBottomTabNavigation()

  // const createTransaction = useCreateTransaction()

  const bottomSheetModalRef = useRef<BottomSheetModal>(null)
  const bottomSheetDataRef = useRef<BottomSheetData>()

  const handlePresentModalPress: HandlePresentModalPress = useCallback(
    (data) => {
      bottomSheetModalRef.current?.present()
      bottomSheetDataRef.current = data
    },
    [],
  )

  return (
    <SafeAreaView className="bg-mauveDark1 flex-1" insets={insetsRef.current}>
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

        <CreateTransactionForm
          bottomSheetModalRef={bottomSheetModalRef}
          handlePresentModalPress={handlePresentModalPress}
          bottomSheetDataRef={bottomSheetDataRef}
        />

        <ScaleDownPressable
          onPress={() => {
            handlePresentModalPress(undefined)
            // createTransaction.mutate(
            //   {
            //     amount: Number(amount),
            //     fundId: 7,
            //   },
            //   {
            //     onSuccess: () => {
            //       navigation.navigate("Transactions")
            //     },
            //   },
            // )
          }}
        >
          <Button className="h-12 w-full rounded-2xl">
            <Text className="text-mauveDark1 font-satoshi-bold text-lg leading-6">
              Save
            </Text>
          </Button>
        </ScaleDownPressable>
      </View>
    </SafeAreaView>
  )
}

function CreateTransactionForm({
  bottomSheetModalRef,
  handlePresentModalPress,
  bottomSheetDataRef,
}: {
  bottomSheetModalRef: RefObject<BottomSheetModal>
  bottomSheetDataRef: RefObject<BottomSheetData>
  handlePresentModalPress: HandlePresentModalPress
}) {
  const [amount, setAmount] = useAmount(0)
  const storeListBottomSheetRef = useRef<BottomSheetModal>(null)

  return (
    <FormProvider>
      <View className="flex-grow items-center justify-center">
        <Amount amount={amount} />
      </View>

      <FormDetailsPreview handlePresentModalPress={handlePresentModalPress} />

      <Numpad setAmount={setAmount} className="mb-8" />

      <TransactionCreateBottomSheet
        ref={bottomSheetModalRef}
        bottomSheetDataRef={bottomSheetDataRef}
        storeListBottomSheetRef={storeListBottomSheetRef}
      />

      <StoreListBottomSheet
        ref={storeListBottomSheetRef}
        bottomSheetDataRef={bottomSheetDataRef}
      />
    </FormProvider>
  )
}

function FormDetailsPreview({
  handlePresentModalPress,
}: {
  handlePresentModalPress: HandlePresentModalPress
}) {
  const { formData } = useFormData()
  const formattedDate = formatRelative(formData.createdAt, new Date())
  let [date, time] = formattedDate.split(" at ")

  // NOTE: does not include year
  // TODO: include year if not this year
  date = date?.includes("/") ? format(formData.createdAt, "MMM d") : date
  time = time || format(formData.createdAt, "K:mm aa")

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
              formData.note ? "text-mauveDark12" : "text-mauveDark11",
            )}
          >
            {formData.note || "Add Note"}
          </Text>
        </Pressable>
      </View>
      <View className="border-b-mauveDark5 h-10 w-full flex-row items-center border-b">
        <Text className="text-mauveDark11 font-satoshi-bold text-base leading-6">
          Store
        </Text>
        <Text className="text-mauveDark11 font-satoshi-bold mx-4 text-base leading-6">
          ·
        </Text>
        <Text className="text-mauveDark11 font-satoshi-bold text-base leading-6">
          Fund
        </Text>
      </View>
    </View>
  )
}

// function useCreateTransaction() {
//   const utils = trpc.useContext()
//   return trpc.transaction.create.useMutation({
//     // onMutate: async (newTransaction) => {
//     //   await utils.transaction.all.cancel()
//     //   const previousTransactions = utils.transaction.all.getData() || []
//     //   utils.transaction.all.setData(undefined, [
//     //     {
//     //       ...newTransaction,
//     //       id: "asd",
//     //       date: new Date(),
//     //       amount: newTransaction.amount || null,
//     //     },
//     //     ...previousTransactions,
//     //   ])
//     // },
//     onSuccess: () => utils.transaction.all.invalidate(),
//   })
// }
