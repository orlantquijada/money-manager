import type { TimeMode } from ".prisma/client";
import { AnimatePresence } from "moti";
import { type ReactNode, useRef, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import type { setScreen } from "~/screens/create-fund";
import { useHardwareBackPress } from "~/utils/hooks/useHardwareBackPress";
import { useRootStackNavigation } from "~/utils/hooks/useRootStackNavigation";
import { useRootStackRoute } from "~/utils/hooks/useRootStackRoute";
import { transitions } from "~/utils/motion";
import { trpc } from "~/utils/trpc";
import CreateFooter from "../CreateFooter";
import Presence from "../Presence";
import StyledMotiView from "../StyledMotiView";
import { CurrencyInput } from "../TextInput";
import Choice from "./Choice";
import { useFormData } from "./context";

const DELAY = 40;

export default function SpendingInfo({
  onBackPress,
  setScreen,
}: {
  onBackPress: () => void;
  setScreen: setScreen;
}) {
  useHardwareBackPress(onBackPress);

  const { formData } = useFormData();
  const [selectedChoice, setSelectedChoice] = useState<TimeMode>(
    formData.timeMode
  );

  return (
    <Wrapper
      onBackPress={onBackPress}
      selectedTimeMode={selectedChoice}
      setScreen={setScreen}
    >
      <View className="mb-8">
        <Presence delay={DELAY} delayMultiplier={1}>
          <Text className="font-satoshi-medium text-lg text-mauveDark12">
            How frequent do you use this fund?
          </Text>
        </Presence>

        <View className="mt-[10px] flex w-3/5">
          <Presence delay={DELAY} delayMultiplier={2}>
            <Choice
              choiceLabel="A"
              className="mb-2"
              onPress={() => setSelectedChoice("WEEKLY")}
              selected={selectedChoice === "WEEKLY"}
            >
              Weekly
            </Choice>
          </Presence>
          <Presence delay={DELAY} delayMultiplier={3}>
            <Choice
              choiceLabel="B"
              className="mb-2"
              onPress={() => setSelectedChoice("MONTHLY")}
              selected={selectedChoice === "MONTHLY"}
            >
              Monthly
            </Choice>
          </Presence>

          <Presence delay={DELAY} delayMultiplier={4}>
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
  );
}

const readableTimeModeMap: Record<TimeMode, string> = {
  WEEKLY: "weekly",
  MONTHLY: "monthly",
  BIMONTHLY: "twice a month",
  EVENTUALLY: "",
};

type WrapperProps = {
  children: ReactNode;
  onBackPress: () => void;
  setScreen: setScreen;
  selectedTimeMode?: TimeMode;
};
// necessary Wrapper component since <Choice/> always animates on rerender
// ^ controlled TextInput below triggers rerender
function Wrapper({
  children,
  onBackPress,
  setScreen,
  selectedTimeMode,
}: WrapperProps) {
  const currencyInputRef = useRef<CurrencyInput>(null);
  const { setFormValues, formData } = useFormData();
  const route = useRootStackRoute("CreateFund");
  const navigation = useRootStackNavigation();
  const createFund = trpc.fund.create.useMutation();
  const utils = trpc.useContext();
  const [didSubmit, setDidSubmit] = useState(false);

  const handleSetFormValues = () => {
    const budgetedAmount = currencyInputRef.current?.getValue() || 0;
    setFormValues(
      selectedTimeMode
        ? { budgetedAmount, timeMode: selectedTimeMode }
        : { budgetedAmount }
    );
  };

  const handleBackPress = () => {
    onBackPress();
    handleSetFormValues();
  };

  const loading = createFund.status === "loading" || didSubmit;
  const disabled = !selectedTimeMode || loading;

  return (
    <>
      <ScrollView
        className="p-4 pt-0"
        contentContainerStyle={{ paddingBottom: 16 }}
      >
        {children}
        {selectedTimeMode ? (
          <Presence delay={DELAY} delayMultiplier={5}>
            <View className="gap-[10px]">
              <View className="flex-row">
                <Text
                  className="font-satoshi-medium text-lg text-mauveDark12"
                  style={{ lineHeight: undefined }}
                >
                  How much will you allocate{" "}
                </Text>
                <View className="relative">
                  <AnimatePresence initial={false}>
                    <TimeModeText
                      key={selectedTimeMode}
                      timeMode={selectedTimeMode}
                    />
                  </AnimatePresence>
                </View>
              </View>
              <CurrencyInput
                defaultValue={formData.budgetedAmount?.toString()}
                ref={currencyInputRef}
              />
            </View>
          </Presence>
        ) : null}
      </ScrollView>
      <CreateFooter
        disabled={disabled}
        loading={loading}
        onBackPress={handleBackPress}
        onContinuePress={() => {
          if (!selectedTimeMode) {
            return;
          }
          setDidSubmit(true);

          const folderId = route.params?.folderId;
          if (!folderId) {
            handleSetFormValues();
            setScreen("chooseFolder");
            return;
          }

          const budgetedAmount = currencyInputRef.current?.getValue() || 0;
          createFund.mutate(
            {
              ...formData,
              budgetedAmount,
              folderId,
              timeMode: selectedTimeMode,
            },
            {
              onSuccess: () => {
                utils.fund.list.invalidate();
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
                    });
                  })
                  .catch(() => {
                    return;
                  });
              },
            }
          );
        }}
      >
        Continue
      </CreateFooter>
    </>
  );
}

function TimeModeText({ timeMode }: { timeMode: TimeMode }) {
  return (
    <StyledMotiView
      animate={{ translateY: 0, opacity: 1 }}
      className="absolute top-0 left-0"
      exit={{ translateY: -20, opacity: 0 }}
      from={{ translateY: 20, opacity: 0 }}
      transition={transitions.snappy}
    >
      <Text
        className="font-satoshi-medium text-lg text-mauveDark12"
        style={{ lineHeight: undefined }}
      >
        {readableTimeModeMap[timeMode]}?
      </Text>
    </StyledMotiView>
  );
}
