import { ReactNode, useRef, useState } from "react"
import { View, Text, ScrollView } from "react-native"
import { AnimatePresence } from "moti"

import { useHardwareBackPress } from "~/utils/hooks/useHardwareBackPress"
import { useRootStackRoute } from "~/utils/hooks/useRootStackRoute"
import { useRootStackNavigation } from "~/utils/hooks/useRootStackNavigation"
import { trpc } from "~/utils/trpc"
import { transitions } from "~/utils/motion"
import { userId } from "~/utils/constants"

import { setScreen } from "~/screens/create-fund"

import { TimeMode } from ".prisma/client"
import { useFormData } from "./context"
import Presence from "../Presence"
import { CurrencyInput } from "../TextInput"
import Choice from "./Choice"
import CreateFooter from "../CreateFooter"
import StyledMotiView from "../StyledMotiView"

const DELAY = 40

export default function SpendingInfo({
  onBackPress,
  setScreen,
}: {
  onBackPress: () => void
  setScreen: setScreen
}) {
  useHardwareBackPress(onBackPress)

  const { formData } = useFormData()
  const [selectedChoice, setSelectedChoice] = useState<TimeMode>(
    formData.timeMode,
  )

  return (
    <Wrapper
      onBackPress={onBackPress}
      setScreen={setScreen}
      selectedTimeMode={selectedChoice}
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
              onPress={() => setSelectedChoice("WEEKLY")}
              selected={selectedChoice === "WEEKLY"}
            >
              Weekly
            </Choice>
          </Presence>
          <Presence delayMultiplier={3} delay={DELAY}>
            <Choice
              choiceLabel="B"
              className="mb-2"
              onPress={() => setSelectedChoice("MONTHLY")}
              selected={selectedChoice === "MONTHLY"}
            >
              Monthly
            </Choice>
          </Presence>

          <Presence delayMultiplier={4} delay={DELAY}>
            <Choice
              choiceLabel="C"
              onPress={() => setSelectedChoice("BIMONTHLY")}
              selected={selectedChoice === "BIMONTHLY"}
            >
              Twice a Month
            </Choice>
          </Presence>
        </View>
      </View>
    </Wrapper>
  )
}

const readableTimeModeMap: Record<TimeMode, string> = {
  WEEKLY: "weekly",
  MONTHLY: "monthly",
  BIMONTHLY: "twice a month",
  EVENTUALLY: "",
}

type WrapperProps = {
  children: ReactNode
  onBackPress: () => void
  setScreen: setScreen
  selectedTimeMode?: TimeMode
}
// necessary Wrapper component since <Choice/> always animates on rerender
// ^ controlled TextInput below triggers rerender
function Wrapper({
  children,
  onBackPress,
  setScreen,
  selectedTimeMode,
}: WrapperProps) {
  const currencyInputRef = useRef<CurrencyInput>(null)
  const { setFormValues, formData } = useFormData()
  const route = useRootStackRoute("CreateFund")
  const navigation = useRootStackNavigation()
  const createFund = trpc.fund.create.useMutation()
  const utils = trpc.useContext()
  const [didSubmit, setDidSubmit] = useState(false)

  const handleSetFormValues = () => {
    const budgetedAmount = currencyInputRef.current?.getValue() || 0
    setFormValues(
      selectedTimeMode
        ? { budgetedAmount, timeMode: selectedTimeMode }
        : { budgetedAmount },
    )
  }

  const handleBackPress = () => {
    onBackPress()
    handleSetFormValues()
  }

  const loading = createFund.status === "loading" || didSubmit
  const disabled = !selectedTimeMode || loading

  return (
    <>
      <ScrollView
        className="p-4 pt-0"
        contentContainerStyle={{ paddingBottom: 16 }}
      >
        {children}
        {selectedTimeMode ? (
          <Presence delayMultiplier={5} delay={DELAY}>
            <View className="gap-[10px]">
              <View className="flex-row">
                <Text
                  className="text-mauveDark12 font-satoshi-medium text-lg"
                  style={{ lineHeight: undefined }}
                >
                  How much will you allocate{" "}
                </Text>
                <View className="relative">
                  <AnimatePresence initial={false}>
                    <TimeModeText
                      timeMode={selectedTimeMode}
                      key={selectedTimeMode}
                    />
                  </AnimatePresence>
                </View>
              </View>
              <CurrencyInput
                ref={currencyInputRef}
                defaultValue={formData.budgetedAmount?.toString()}
              />
            </View>
          </Presence>
        ) : null}
      </ScrollView>
      <CreateFooter
        disabled={disabled}
        loading={loading}
        onContinuePress={() => {
          if (!selectedTimeMode) return

          const folderId = route.params?.folderId
          if (!folderId) {
            handleSetFormValues()
            setScreen("chooseFolder")
            return
          }

          const budgetedAmount = currencyInputRef.current?.getValue() || 0
          setDidSubmit(true)
          createFund.mutate(
            {
              ...formData,
              budgetedAmount,
              folderId,
              timeMode: selectedTimeMode,
              userId,
            },
            {
              onSuccess: () => {
                utils.folder.listWithFunds
                  .invalidate()
                  .then(() => {
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
                  .catch(() => {
                    return
                  })
              },
            },
          )
        }}
        onBackPress={handleBackPress}
      >
        Continue
      </CreateFooter>
    </>
  )
}

function TimeModeText({ timeMode }: { timeMode: TimeMode }) {
  return (
    <StyledMotiView
      from={{ translateY: 20, opacity: 0 }}
      animate={{ translateY: 0, opacity: 1 }}
      exit={{ translateY: -20, opacity: 0 }}
      className="absolute left-0 top-0"
      transition={transitions.snappy}
    >
      <Text
        className="text-mauveDark12 font-satoshi-medium text-lg"
        style={{ lineHeight: undefined }}
      >
        {readableTimeModeMap[timeMode]}?
      </Text>
    </StyledMotiView>
  )
}
