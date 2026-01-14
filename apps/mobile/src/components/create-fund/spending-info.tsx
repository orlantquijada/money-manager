import type { TimeMode } from "api";
import { ScrollView } from "react-native";
import Animated, {
  FadeInDown,
  FadeOutUp,
  Reanimated3DefaultSpringConfig,
} from "react-native-reanimated";
import { StyledLeanText, StyledLeanView } from "@/config/interop";
import {
  type CreateFundScreens,
  useCreateFundStore,
  useSubmitFund,
} from "@/lib/create-fund";
import { transitions } from "@/utils/motion";

import Presence from "../presence";
import { CurrencyInput } from "../text-input";
import Choice from "./choice";
import CreateFooter from "./footer";

const DELAY = 40;

type Props = {
  setScreen: (screen: CreateFundScreens) => void;
  presetFolderId: number | null;
};

export default function SpendingInfo({ setScreen, presetFolderId }: Props) {
  const timeMode = useCreateFundStore((s) => s.timeMode);
  const setTimeMode = useCreateFundStore((s) => s.setTimeMode);
  const budgetedAmount = useCreateFundStore((s) => s.budgetedAmount);
  const setBudgetedAmount = useCreateFundStore((s) => s.setBudgetedAmount);

  const { submit, isPending } = useSubmitFund();

  return (
    <>
      <ScrollView
        className="px-4 pt-20"
        contentContainerClassName="pb-safe-offset-4 flex gap-y-8"
      >
        <StyledLeanView className="mb-8">
          <Presence delay={DELAY} delayMultiplier={1}>
            <StyledLeanText className="font-satoshi-medium text-foreground text-lg">
              How frequent do you use this fund?
            </StyledLeanText>
          </Presence>

          <StyledLeanView className="mt-2.5 flex w-3/5 gap-2">
            <Presence delay={DELAY} delayMultiplier={2}>
              <Choice
                choiceLabel="A"
                onPress={() => setTimeMode("WEEKLY")}
                selected={timeMode === "WEEKLY"}
              >
                Weekly
              </Choice>
            </Presence>
            <Presence delay={DELAY} delayMultiplier={3}>
              <Choice
                choiceLabel="B"
                onPress={() => setTimeMode("MONTHLY")}
                selected={timeMode === "MONTHLY"}
              >
                Monthly
              </Choice>
            </Presence>

            <Presence delay={DELAY} delayMultiplier={4}>
              <Choice
                choiceLabel="C"
                onPress={() => setTimeMode("BIMONTHLY")}
                selected={timeMode === "BIMONTHLY"}
              >
                Twice a Month
              </Choice>
            </Presence>
          </StyledLeanView>
        </StyledLeanView>

        {timeMode && (
          <Presence delay={DELAY} delayMultiplier={5}>
            <StyledLeanView className="gap-2.5">
              <StyledLeanView className="flex-row">
                <StyledLeanText
                  className="font-satoshi-medium text-foreground text-lg"
                  style={{ lineHeight: undefined }}
                >
                  How much will you allocate{" "}
                </StyledLeanText>
                <StyledLeanView className="relative">
                  <TimeModeText key={timeMode} timeMode={timeMode} />
                </StyledLeanView>
              </StyledLeanView>
              <CurrencyInput
                onChangeText={(text) => setBudgetedAmount(Number(text) || 0)}
                value={budgetedAmount.toString()}
              />
            </StyledLeanView>
          </Presence>
        )}
      </ScrollView>

      <CreateFooter
        disabled={!timeMode || budgetedAmount <= 0 || isPending}
        loading={isPending}
        onBackPress={() => {
          setScreen("fundInfo");
        }}
        onContinuePress={() => {
          if (presetFolderId) {
            submit(presetFolderId);
          } else {
            setScreen("chooseFolder");
          }
        }}
        variant={presetFolderId ? "text" : "icon-only"}
      >
        {presetFolderId ? "Create Fund" : undefined}
      </CreateFooter>
    </>
  );
}

function TimeModeText({ timeMode }: { timeMode: TimeMode }) {
  return (
    <Animated.View
      className="absolute top-0 left-0"
      entering={FadeInDown.springify()
        .damping(transitions.snappy.damping)
        .stiffness(transitions.snappy.stiffness)
        .mass(Reanimated3DefaultSpringConfig.mass)}
      exiting={FadeOutUp.springify()
        .damping(transitions.snappy.damping)
        .stiffness(transitions.snappy.stiffness)
        .mass(Reanimated3DefaultSpringConfig.mass)}
    >
      <StyledLeanText
        className="font-satoshi-medium text-foreground text-lg"
        style={{ lineHeight: undefined }}
      >
        {readableTimeModeMap[timeMode]}?
      </StyledLeanText>
    </Animated.View>
  );
}

const readableTimeModeMap: Record<TimeMode, string> = {
  WEEKLY: "weekly",
  MONTHLY: "monthly",
  BIMONTHLY: "twice a month",
  EVENTUALLY: "",
};
