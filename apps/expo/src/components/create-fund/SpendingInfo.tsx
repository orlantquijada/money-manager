import { View, Text } from "react-native"
import { ScrollView } from "react-native-gesture-handler"

import Presence from "../Presence"
import { CurrencyInput } from "../TextInput"
import Choice from "./Choice"
import CreateFooter from "../CreateFooter"
import { ReactNode, useRef, useState } from "react"
import { useFormData } from "./context"
import { useHardwareBackPress } from "~/utils/hooks/useHardwareBackPress"
import { useRootStackRoute } from "~/utils/hooks/useRootStackRoute"
import { setScreen } from "~/screens/create-fund"
import { useRootStackNavigation } from "~/utils/hooks/useRootStackNavigation"
import { trpc } from "~/utils/trpc"

const DELAY = 40

type Choices = "weekly" | "monthly" | "bimonthly"

export default function SpendingInfo({
  onBackPress,
  setScreen,
}: {
  onBackPress: () => void
  setScreen: setScreen
}) {
  useHardwareBackPress(onBackPress)

  const [selectedChoice, setSelectedChoice] = useState<Choices>()
  const disabled = !selectedChoice

  return (
    <Wrapper
      onBackPress={onBackPress}
      disabled={disabled}
      setScreen={setScreen}
    >
      <View className="mb-8">
        <Presence delayMultiplier={1} delay={DELAY}>
          <Text className="text-mauveDark12 font-satoshi-medium text-lg">
            How frequent do you use this fund?
          </Text>
        </Presence>

        <View className="mt-[10px] flex w-3/5">
          <Presence delayMultiplier={2} delay={DELAY}>
            <Choice
              choiceLabel="A"
              className="mb-2"
              onPress={() => setSelectedChoice("weekly")}
              selected={selectedChoice === "weekly"}
            >
              Weekly
            </Choice>
          </Presence>
          <Presence delayMultiplier={3} delay={DELAY}>
            <Choice
              choiceLabel="B"
              className="mb-2"
              onPress={() => setSelectedChoice("monthly")}
              selected={selectedChoice === "monthly"}
            >
              Monthly
            </Choice>
          </Presence>

          <Presence delayMultiplier={4} delay={DELAY}>
            <Choice
              choiceLabel="C"
              onPress={() => setSelectedChoice("bimonthly")}
              selected={selectedChoice === "bimonthly"}
            >
              Twice a Month
            </Choice>
          </Presence>
        </View>
      </View>
    </Wrapper>
  )
}

// necessary Wrapper component since <Choice/> always animates on rerender
// ^ controlled TextInput below triggers rerender
function Wrapper({
  children,
  onBackPress,
  setScreen,
  disabled,
}: {
  children: ReactNode
  onBackPress: () => void
  setScreen: setScreen
  disabled: boolean
}) {
  const currencyInputRef = useRef<CurrencyInput>(null)
  const { setFormValues, formData } = useFormData()
  const route = useRootStackRoute("CreateFund")
  const navigation = useRootStackNavigation()

  const { mutate } = trpc.fund.create.useMutation()
  const utils = trpc.useContext()

  return (
    <>
      <ScrollView
        className="p-4 pt-0"
        contentContainerStyle={{ paddingBottom: 16 }}
      >
        {children}
        <Presence delayMultiplier={5} delay={DELAY}>
          <View className="gap-[10px]">
            <Text className="text-mauveDark12 font-satoshi-medium text-lg">
              How much will you allocate?
            </Text>
            <CurrencyInput ref={currencyInputRef} />
          </View>
        </Presence>
      </ScrollView>
      <CreateFooter
        disabled={disabled}
        onContinuePress={() => {
          const folderId = route.params?.folderId
          const budgetedAmount = currencyInputRef.current?.getValue() || 0
          if (!folderId) {
            setFormValues({ budgetedAmount })
            setScreen("chooseFolder")
            return
          }

          mutate(
            { ...formData, budgetedAmount, folderId },
            {
              onSuccess: () => {
                utils.folder.listWithFunds.invalidate().then(() => {
                  navigation.navigate("Root", {
                    screen: "Home",
                    params: { recentlyAddedToFolderId: folderId },
                  })
                })
              },
            },
          )
        }}
        onBackPress={onBackPress}
      />
    </>
  )
}
