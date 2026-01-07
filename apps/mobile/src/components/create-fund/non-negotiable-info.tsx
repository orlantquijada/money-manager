import type { TimeMode } from "api";
import { ScrollView, Text, View } from "react-native";
import Animated, {
  FadeInDown,
  FadeOutUp,
  Reanimated3DefaultSpringConfig,
} from "react-native-reanimated";
import {
  type CreateFundScreens,
  getFundTypeContinueBtnLabel,
  useCreateFundStore,
  useSubmitFund,
} from "@/lib/create-fund";

import { layoutSpringify, transitions } from "@/utils/motion";
import FadingEdge, { useOverflowFadeEdge } from "../fading-edge";
import Presence from "../presence";
import { CurrencyInput } from "../text-input";
import { useThemeColor } from "../theme-provider";
import Choice from "./choice";
import CreateFooter from "./footer";

const DELAY = 40;

type Props = {
  setScreen: (screen: CreateFundScreens) => void;
  presetFolderId: number | null;
};

export default function NonNegotiableInfo({
  setScreen,
  presetFolderId,
}: Props) {
  const timeMode = useCreateFundStore((s) => s.timeMode);
  const setTimeMode = useCreateFundStore((s) => s.setTimeMode);
  const budgetedAmount = useCreateFundStore((s) => s.budgetedAmount);
  const setBudgetedAmount = useCreateFundStore((s) => s.setBudgetedAmount);

  const { submit, isPending } = useSubmitFund();
  const backgroundColor = useThemeColor("background");
  const { fadeProps, handleScroll } = useOverflowFadeEdge();

  return (
    <>
      <FadingEdge fadeColor={backgroundColor} {...fadeProps}>
        <ScrollView
          className="px-4 pt-20"
          contentContainerClassName="pb-safe-offset-4 flex gap-y-8"
          onScroll={handleScroll}
        >
          <View>
            <Presence delay={DELAY} delayMultiplier={1}>
              <Text className="font-satoshi-medium text-foreground text-lg">
                When is this due?
              </Text>
            </Presence>

            <View className="mt-2.5 flex w-3/5 gap-2">
              <Presence delay={DELAY} delayMultiplier={2}>
                <Choice
                  choiceLabel="A"
                  onPress={() => {
                    setTimeMode("WEEKLY");
                  }}
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
                  Bimonthly
                </Choice>
              </Presence>
            </View>
          </View>

          {timeMode && (
            <Presence
              delay={DELAY}
              delayMultiplier={5}
              layout={layoutSpringify("snappy")}
            >
              <View className="gap-2.5">
                <View className="flex-row">
                  <Text
                    className="font-satoshi-medium text-foreground text-lg"
                    style={{ lineHeight: undefined }}
                  >
                    How much is due{" "}
                  </Text>
                  <View className="relative">
                    <TimeModeText key={timeMode} timeMode={timeMode} />
                  </View>
                </View>
                <CurrencyInput
                  onChangeText={(text) => setBudgetedAmount(Number(text) || 0)}
                  value={budgetedAmount.toString()}
                />
              </View>
            </Presence>
          )}
        </ScrollView>
      </FadingEdge>

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
      >
        {getFundTypeContinueBtnLabel(presetFolderId, isPending)}
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
      <Text
        className="font-satoshi-medium text-foreground text-lg"
        style={{ lineHeight: undefined }}
      >
        {readableTimeModeMap[timeMode]}?
      </Text>
    </Animated.View>
  );
}

const readableTimeModeMap: Partial<Record<TimeMode, string>> = {
  WEEKLY: "weekly",
  MONTHLY: "monthly",
  BIMONTHLY: "twice a month",
};
