import { useRef } from "react"
import { View, Text, ScrollView } from "react-native"

import { setScreen } from "~/screens/create-fund"
import { userId } from "~/utils/constants"
import { useRootStackRoute } from "~/utils/hooks/useRootStackRoute"
import { trpc } from "~/utils/trpc"
import { useRootStackNavigation } from "~/utils/hooks/useRootStackNavigation"

import Presence from "../Presence"
import { CurrencyInput } from "../TextInput"
import Choice from "./Choice"
import Footer from "../CreateFooter"
import { useFormData } from "./context"

export default function NonNegotiableInfo({
  onBackPress,
  setScreen,
}: {
  onBackPress: () => void
  setScreen: setScreen
}) {
  const route = useRootStackRoute("CreateFund")
  const currencyInputRef = useRef<CurrencyInput>(null)
  const { setFormValues, formData } = useFormData()
  const createFund = trpc.fund.create.useMutation()
  const navigation = useRootStackNavigation()

  const handleSetFormValues = () => {
    const budgetedAmount = currencyInputRef.current?.getValue() || 0
    setFormValues({ budgetedAmount, timeMode: "MONTHLY" })
  }
  const utils = trpc.useContext()

  return (
    <>
      <ScrollView
        className="p-4 pt-0"
        contentContainerStyle={{ paddingBottom: 16 }}
      >
        <View className="flex gap-y-8">
          <View className="gap-y-[10px]">
            <Presence delayMultiplier={3}>
              <Text className="text-mauveDark12 font-satoshi-medium text-lg">
                How do you intend to budget this fund?
              </Text>
            </Presence>

            <View className="flex w-3/5">
              <Presence delayMultiplier={4}>
                <Choice choiceLabel="A" selected className="mb-2">
                  Monthly
                </Choice>
              </Presence>
            </View>
          </View>

          <Presence delayMultiplier={6}>
            <View className="gap-[10px]">
              <Text className="text-mauveDark12 font-satoshi-medium text-lg">
                How much wil you allocate?
              </Text>
              <CurrencyInput
                ref={currencyInputRef}
                defaultValue={formData.budgetedAmount?.toString()}
              />
            </View>
          </Presence>
        </View>
      </ScrollView>
      <Footer
        onBackPress={onBackPress}
        onContinuePress={() => {
          const folderId = route.params?.folderId

          if (!folderId) {
            handleSetFormValues()
            setScreen("chooseFolder")
            return
          }

          const budgetedAmount = currencyInputRef.current?.getValue() || 0
          createFund.mutate(
            {
              ...formData,
              budgetedAmount,
              folderId,
              timeMode: "MONTHLY",
              userId,
            },
            {
              onSuccess: () => {
                utils.folder.listWithFunds.invalidate().then(() => {
                  navigation.navigate("Root", {
                    screen: "Home",
                    params: {
                      screen: "Budgets",
                      params: {
                        recentlyAddedToFolderId: folderId,
                      },
                    },
                  })
                })
              },
            },
          )
        }}
      >
        Continue
      </Footer>
    </>
  )
}
